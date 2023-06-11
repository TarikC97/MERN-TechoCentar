import mongoose from "mongoose";

const mailTokenSchema = mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
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