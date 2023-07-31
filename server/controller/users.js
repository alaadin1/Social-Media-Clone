import json from "body-parser"
import User from "../models/user.js"

/** GET Single User */
export const getUser = async (req, res) =>{
    try{
        //get the user by the ID
        const {id} = req.params
        if(id){
            const currUser = await User.findById(id)
            res.status(200).json(currUser)
        }
        else{
            res.staus(404).json({msg: 'USER DOESNT EXIST'})
        }

    }
    catch(err){
        res.status(500).json({error:err.msg})
    }
}

/** GET Single User Friends */
export const getUserFriends = async(req,res) =>{
    try{
        //get the user by the ID
        const {id} = req.params
        if(id){
            const currUser = await User.findById(id)
            const friends = await Promise.all(
                currUser.friends.map((id) => User.findById(id))
                
            )
            const formattedFriends = friends.map(
                ({_id, firstName, lastName, occupation, location, picturePath}) =>{
                    return {_id, firstName, lastName, occupation, location, picturePath}
                }
            )

            res.status(200).json(formattedFriends)
        }
        else{
            res.staus(404).json({msg: 'USER DOESNT EXIST'})
        }

    }
    catch(err){
        res.status(500).json({error:err.msg})
    }
}

/** UPDATE */

export const addRemoveFriend = async(req, res) =>{
    try{
        const {id, friendId} = req.params
        const user = await User.findById(id)
        const friend = await User.findById(friendId)

        if(user.friends.includes(friendId)){
            user.friends = user.friends.filter((id) => id!==friendId)
            friend.friends = friend.friends.filter((id) => id!==id)
        }
        else{
            user.friends.push(friendId)
            friend.friends.push(friendId)
        }

        await user.save()
        await friend.save()


        const friends = await Promise.all(
            currUser.friends.map((id) => User.findById(id))
            
        )
        const formattedFriends = friends.map(
            ({_id, firstName, lastName, occupation, location, picturePath}) =>{
                return {_id, firstName, lastName, occupation, location, picturePath}
            }
        )

        res.staus(200).json(formattedFriends)

    }
    catch(err){
        res.status(500).json({error:err.msg})
    }
}