import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
import generateToken from '../utils/generateToken.js'


//@description Auth user & get token
//@route POST/api/users/login
//@access Public
const authUser = asyncHandler(async(req,res)=>{
   //Sending request through postman body
   const {email,password} = req.body
   //Returning one user from db using email.
   const user = await User.findOne({email})
   //Checking if user exists and pw from db and from input match.
   if(user && (await user.matchPassword(password))){
      res.json({
         _id: user._id,
         name: user.name,
         email: user.email,
         isAdmin: user.isAdmin,
         token: generateToken(user._id)
      })
   }
   else{
      res.status(401)
      throw new Error('Invalid email or password')
   }
   // //Sending response 
   // res.send({
   //    email,
   //    password
   // })
})

//@description Get user profile
//@route Get/api/users/profile
//@access Private
const getUserProfile = asyncHandler(async(req,res)=>{
   res.send('Success')
})

export {authUser,getUserProfile}