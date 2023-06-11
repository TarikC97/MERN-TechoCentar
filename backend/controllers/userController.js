import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
import generateToken from '../utils/generateToken.js'
import mailToken from '../models/mailTokenModel.js'
import generateEmail from '../utils/generateEmail.js'
import crypto from 'crypto'


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
      password,
  })
  //After creating user, userId(from Token Colletion) takes
  //id of new user, and we generate random token.
  const mail_token = await new mailToken({
   userId: user._id,
   mailToken: crypto.randomBytes(32).toString("hex")
  }).save()
  const url = `${proccess.env.BASE_URL}users/${user._id}/verify/${mail_token}`
  await sendEmail(user.email,"Verify Email",url)

  //if user is created,display data
  if(user){
      res.status(201).json({
         // _id: user._id,
         // name: user.name,
         // email: user.email,
         // isAdmin: user.isAdmin,
         // token: generateToken(user._id)
         message:"An Email has been sent, please Verify your Email."
      })
  }
  else{
   res.status(400)
   throw new Error('Invalid user data')

  }
})
const verifyUser = asyncHandler(async(req,res)=>{

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

//@description Update user profile
//@route PUT /api/users/profile
//@access Private
const updateUserProfile = asyncHandler(async(req,res)=>{
   const user = await User.findById(req.user._id)

   if(user){
      user.name = req.body.name || user.name
      user.email = req.body.email || user.email
      if(req.body.password){
         user.password = req.body.password
      }

      const updatedUser = await user.save()
      
      res.json({
         _id: updatedUser._id,
         name: updatedUser.name,
         email: updatedUser.email,
         isAdmin: updatedUser.isAdmin,
         token: generateToken(updatedUser._id)
      })
   }
   else{
      res.status(404)
      throw new Error('User not found')
   }
})

//@description Get all users
//@route Get/api/users
//@access Private/Admin
//Getting all users only as ADMIN
const getUsers = asyncHandler(async(req,res)=>{
   //{} - get all users
   const users = await User.find({})
   res.json(users)
})
//@description Delete user
//@route DELETE/api/users/:id
//@access Private/Admin
const deleteUser = asyncHandler(async(req,res)=>{
   //Finding user by id in headers
   const user = await User.findById(req.params.id)
   if(user){
      if(user.isAdmin){
         res.status(400)
         throw new Error('Cannot delete Admin User')
      }
      await User.deleteOne({_id: user._id})
      res.json({message:'User removed'})
   }
   else{
      res.status(404)
      throw new Error('User not found')
   }
})
//@description Get user by id as ADMIN
//@route GET/api/users/:id
//@access Private/Admin
const getUserById = asyncHandler(async(req,res)=>{
   //Finding user by id in headers
   const user = await User.findById(req.params.id).select('-password')
   if(user){
       res.json(user)
   }
   else{
      res.status(404)
      throw new Error('User not Found')
   }
})

//@description Update user as ADMIN
//@route PUT/api/users/profile
//@access Private/ADMIN
const updateUser = asyncHandler(async(req,res)=>{
   const user = await User.findById(req.params.id)

   if(user){
      user.name = req.body.name || user.name
      user.email = req.body.email || user.email
      user.isAdmin = Boolean(req.body.isAdmin) 

      const updatedUser = await user.save()
      
      res.json({
         _id: updatedUser._id,
         name: updatedUser.name,
         email: updatedUser.email,
         isAdmin: updatedUser.isAdmin,
      })
   }
   else{
      res.status(404)
      throw new Error('User not found')
   }
})
export {
   authUser,
   registerUser,
   verifyUser, 
   getUserProfile,
   updateUserProfile,
   getUsers,
   deleteUser,
   getUserById,
   updateUser,
}