import express from "express";
import { authUser,getUserProfile,registerUser,updateUserProfile,getUsers, deleteUser,getUserById,updateUser, verifyEmail } from '../controllers/userController.js'
import {protect,admin} from '../middleware/authMiddleware.js'

const router = express.Router()

//Getting al users as ADMIn
router.route('/').post(registerUser).get(protect,admin,getUsers)
router.route('/verifyOTP/').post(verifyEmail)
router.post('/login',authUser)
router.route('/profile').get(protect,getUserProfile).put(protect, updateUserProfile)
//Admin deleting users,Admin getting user,Admin updating user
router
.route('/:id')
.delete(protect,admin,deleteUser)
.get(protect,admin,getUserById)
.put(protect,admin,updateUser)

export default router