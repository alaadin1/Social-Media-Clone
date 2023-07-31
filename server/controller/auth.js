import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'
import User from "../models/user.js"

/** Register User */
export const register = async (req, res) =>{
    try{
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation
        } = req.body

        //encrypt the password using bcrypt getSalt method
        const salt = await bcrypt.genSalt()
        const passwordHash = await bcrypt.hash(password, salt)
        
        //create the new User with the encrypted password
        const newUser = new User({
            firstName,
            lastName,
            email,
            passwordHash,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 10000),
            impressions: Math.floor(Math.random() * 10000)
        })

        const savedUser = await newUser.save()
        res.status(201).json(savedUser)
    }
    catch(err){
        res.status(500).json({ error: err.message})
    }
}

/** Logging in */
export const login = async(req,res) =>{
    try{

        //get the email and password from the request body
        const {email, password} = req.body

        //check the mongoDB to see if the user exists
        const user = await User.findOne({email:email})
        if(!user) return res.status(400).json({msg: "User does not exisit"})

        //check the mongoDB to see if the password matches the user
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch) return res.status(400).json({msg:"Invalid Credentials"})

        //if the email exists and the user put in the correct password, give an auth token to the user
        const token = jwt.sign({ id: user._id}, process.env.JWT_SECRET)
        delete user.password
        res.status(200).json({token, user})
    }

    catch(error){
        res.status(500).json({ error: err.message })
    }
}