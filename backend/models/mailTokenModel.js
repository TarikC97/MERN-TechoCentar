import mongoose from "mongoose";
const Schema = mongoose.Schema

const mailTokenSchema = new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:"User",
        unique: true,
    },
    mailToken:{
        type: String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expiresIn: '200d'
    }
})
const mailToken = mongoose.model('mailToken',mailTokenSchema)
export default mailToken