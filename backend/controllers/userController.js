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

//@description Register a new user
//@route POST/api/users
//@access Public
const registerUser = asyncHandler(async(req,res)=>{
   //Sending request through postman body
   const {name,email,password} = req.body
   //Checking if user exists in db
   const userExists = await User.findOne({email})
   //Checking if user exists and pw from db and from input match.
  if(userExists){
   res.status(400)
   throw new Error('User already exists')
  }
  //Creating new user
  const user = await User.create({
      name,
      email,
      //Hashing pw in userModel
      password
  })
  //if user is created,display data
  if(user){
      res.status(201).json({
         _id: user._id,
         name: user.name,
         email: user.email,
         isAdmin: user.isAdmin,
         token: generateToken(user._id)
      })
  }
  else{
   res.status(400)
   throw new Error('Invalid user data')

  }
})

//@description Get user profile
//@route Get/api/users/profile
//@access Private
const getUserProfile = asyncHandler(async(req,res)=>{
   const user = await User.findById(req.user._id)

   if(user){
      res.json({
         _id: user._id,
         name: user.name,
         email: user.email,
         isAdmin: user.isAdmin,
      })
   }
   else{
      res.status(404)
      throw new Error('User not found')
   }
})

export {authUser,registerUser, getUserProfile}