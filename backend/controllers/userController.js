import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
import generateToken from '../utils/generateToken.js'
import bcrypt from 'bcryptjs'
import UserOTPVerification from '../models/userOTPVerification.js'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

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
  //if user is created,display data
  if(user){
   sendOTPVerificationEmail(user,res)
   // res.status(201).json({
   //    // _id: user._id,
   //    // name: user.name,
   //    // email: user.email,
   //    // isAdmin: user.isAdmin,
   //    // token: generateToken(user._id)
     
   // })
  }
  else{
   res.status(400)
   throw new Error('Invalid user data')

  }
})

let transporter = nodemailer.createTransport({
   host:"smtp.gmail.com",
   secure: true,
   auth:{
      user:process.env.USER,
      pass:process.env.PASS,
   }
})
//Sending Mail to user.email created at form.
const sendOTPVerificationEmail = async({_id,email},res)=>{
   try {
      //Generating 4 random numbers
      //Between 1000-9999,floor avoid decimals.
      const otp = `${Math.floor(Math.random()*9000)}`

      const mailOptions = {
         from: process.env.USER,
         to: email,
         subject:"Verify Your Email",
         html:`<p>Enter <b>${otp}</b> in the app to verify your Email.
               </p><p>This code <b> expires in 1 hour.</p>`
      }

      //Has otp code
      const saltRounds = 10
      const hashedOTP = await bcrypt.hash(otp,saltRounds)

      const newOTPVerifciation = await UserOTPVerification.create({
         userId: _id,
         otp: hashedOTP,
         //Hashing pw in userModel
         createdAt: Date.now(),
         expiresAt: Date.now()*360000,
     })
     await newOTPVerifciation.save()
     await transporter.sendMail(mailOptions)
     res.status(201).json({
      status:"PENDING",
      message:"Verification otp mail sent",
      data:{
         userId: _id,
         email,
         }
     })
   } catch (error) {
      res.json({
         status:"FAILED",
         message: error.message,
      })
   }
}
//Verifying user that received mail.
const verifyEmail = async(req,res)=>{
   try {
      let { userId,otp} = req.body
      if(!userId || !otp){
         throw new Error("Empty otp details are not allowed")
      }
      else{
         const UserOTPVerificationRecords = await UserOTPVerification.find({
            userId
         })
         if(UserOTPVerificationRecords.length <=0){
            //No record found
            throw new Error("Account doesnt exist , or it has been already veified!")
         }
         else{
            //otp record exists
            const {expiresAt } = UserOTPVerificationRecords[0]
            const hashedOTP = UserOTPVerificationRecords[0].otp
            if(expiresAt < Date.now()){
               //otp record has expired
               await UserOTPVerificationRecords.deleteOne({userId})
               throw new Error("Code has expired. Please request again!")
            }
            else{
               //Compared received otp from db hashedOTP
              const validOTP = await bcrypt.compare(otp,hashedOTP)
              if(!validOTP){
               //otp is wrong
               throw new Error("Invalid code passed.")
              }
              else{
               //success
               await User.updateOne({_id:userId},{verified:true})
               await UserOTPVerification.deleteOne({userId})
               res.json({
                  status: "VERIFIED",
                  message:"User email verified successfully!"
               })
              }
            }
         }
      }
   } catch (error) {
      res.json({
         status:"FAILED",
         message:error.message
      })
   }

}
//Resend email verification
const resendEmail = async(req,res)=>{
   try {
      let{userId,email} = req.body

      if(!userId || !email){
         throw Error("Empty user details not allowed")
      }
      else{
         //Delete existing record and resend
         await User.updateOne({_id:userId},{verified:false})
         await UserOTPVerification.deleteOne({userId})
         sendOTPVerificationEmail({_id:userId,email},res)
      }
   } catch (error) {
      res.json({
         status:"FAILED",
         message: error.message
      })
   }


}

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
   sendOTPVerificationEmail,
   verifyEmail,
   resendEmail,
   getUserProfile,
   updateUserProfile,
   getUsers,
   deleteUser,
   getUserById,
   updateUser,
}