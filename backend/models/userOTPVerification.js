import mongoose from "mongoose";

const UserOTPVerificationSchema = mongoose.Schema({
    user:{
        //Which user(admin)create which product
         type: mongoose.Schema.Types.ObjectId,
         required: true,
         //Ads relationship between product and user
         ref:'User'
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        unique: true,
    },
    otp:{
        type: String,
        required:true,
    },
    createdAt:{
        type:Date,
    },
    expiresAt:{
        type:Number,
    }
})
const UserOTPVerification = mongoose.model('UserOTPVerification',UserOTPVerificationSchema)
export default UserOTPVerification