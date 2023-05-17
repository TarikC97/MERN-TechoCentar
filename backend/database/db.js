import mongoose from "mongoose";

const connectDB = async () =>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI,{
            useUnifiedTopology: true,
            useNewUrlParser: true
        })
     console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline)
    }catch(error){
        console.error(`Error:${error.message}`.red.underline.bold)
        process.exit(1)
        //(1)Means exit with failure
    }
}
export default connectDB