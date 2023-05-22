import mongoose from "mongoose";
import bcrypt from 'bcryptjs'

const userSchema = mongoose.Schema({
    name: {
        type:String,
        required: true
    },
    email: {
        type:String,
        required: true,
        unique: true
    },
    password: {
        type:String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    },
},{
    timestamps: true
}
)
//Checking (type) passwords
userSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password)
}

//Adding middleware for encrypred pw
//Before saving data(Pre), we encrypt pw
userSchema.pre('save', async function(next){
    //On Update profile, we need to this method
    //To prevent hashing pass again.
    if(!this.isModified('password')){
        //If pw is not modified,continue
        next()
    }
    //Generating hash using method genSalt
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password,salt)
})

const User = mongoose.model('User',userSchema)

export default User