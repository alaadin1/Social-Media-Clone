import Post from "../models/Post.js"
import User from "../models/user.js"


/** Create a Post */

export const createPost = async(req, res) =>{
    try{
        const {userId, description, picturePath} = req.body
        const user = await User.findById (userId);
        const newPost = new Post({
            userId,
            firstName: user.firstName,
            lastName:user.firstName,
            location:user.location,
            description,
            userPicturePath:user.picturePath,
            picturePath,
            likes:{},
            comments: []
        })
        await newPost.save()
        const post = await Post.find()
        res.status(201).json(post)
        
    }
    catch(error){
        res.status(409).json({error:error.msg})
    }
}

/** Get a user post */
export const getFeedPosts = async(req,res) =>{
    try{
        const post = await Post.find()
        res.status(200).json(post)
    }
    catch(error){
        res.status(404).json({error:error.msg})
    }
}
export const getUserPosts = async(req,res) =>{
    try{
        const {userId} = req.params
        const post = await Post.find({ userId })
        res.status(200).json(post)
    }
    catch(error){
        res.status(404).json({error:error.msg})
    }
}

/** UPDATE */
export const likePost = async(req,res) =>{
    try{

        //grab userId from frontend
        const {id} = req.params
        const {userId} = req.body
        const post = await Post.findById(id)

        //see if the user has liked the post already by searching the likes object 
        const isLiked = post.likes.get(userId)
        

        //if the user has liked the post, a second press on the like will delete the like
        // else well add a like
        if(isLiked){
            post.likes.delete(userId);
        } else {
            post.likes.set(userId, true)
        }

        //update the post with the like that we just made
        const updatedPost = await Post.findByIdAndUpdate(
            id,
            {likes:post.likes},
            {new:true}
        );

        res.status(200).json(updatedPost)
    }
    catch(error){
        res.status(404).json({error:error.msg})
    }
}