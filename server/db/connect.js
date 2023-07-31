import mongoose from 'mongoose'


const connectDB = (url) =>{
    mongoose
    .connect(url, {
        useNewUrlParser:true,
        useUnifiedTopology:true,
    })
}
export default connectDB

//where the conenction string is the one we coppied from mongoDB connection