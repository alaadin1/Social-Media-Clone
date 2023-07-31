import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import cors from "cors"
import dotenv from "dotenv"
import multer from "multer"
import helmet from "helmet"
import morgan from 'morgan'
import path from "path"
import { fileURLToPath } from 'url'
import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'
import postRoutes from './routes/posts.js'
import {createPost} from './controller/posts.js'




import connectDB from './db/connect.js'
import {register} from './controller/auth.js'
import { verifyToken } from './middleware/auth.js'


/** Middleware configurations */

//needed since we imported instead of required
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

//allows us to use .env files content with process.env
dotenv.config()

//middleware (will apply to all our routes)
const app = express()
app.use(express.json())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({policy:"cross-origin"}))
app.use(morgan("common"))
app.use(bodyParser.json({limit:'30mb', extended:true}))
app.use(bodyParser.urlencoded({limit:'30mb', extended:true}))

//sets directory where we keep our app
app.use('/assets', express.static(path.join(__dirname, 'public/assets')))

//File Storage
const storage = multer.diskStorage({
    destination: function( req, file, cb) {
        cb(null, "public/assets")
    },
    filename: function(req,file,cb){
        cb(null, file.originalname)
    }
});

const upload = multer({storage})

//Route with files
// app.get('/', (req,res)=>{
//     res.send('hi')
// })
app.post("/auth/register", upload.single("picture"), register)
app.post('/posts', verifyToken, upload.single("picture"), createPost)


/** ROUTES */
app.use('/auth', authRoutes)
app.use('/users', userRoutes)
app.use('/posts', postRoutes)


/** connect our server to mongoose */
const start = async() =>{
    try{
        await connectDB(process.env.MONGO_URL)
        app.listen(process.env.PORT, ()=>{
            console.log(`Listening on PORT ${process.env.PORT}...`)
        })
    }
    catch(error){
        console.log(error)
    }
}

start()