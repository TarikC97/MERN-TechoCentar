import express from "express";
import { authUser,getUserProfile,registerUser,updateUserProfile,getUsers, deleteUser } from '../controllers/userController.js'
import {protect,admin} from '../middleware/authMiddleware.js'

const router = express.Router()

//Getting al users as ADMIn
router.route('/').post(registerUser).get(protect,admin,getUsers)
router.post('/login',authUser)
router.route('/profile').get(protect,getUserProfile).put(protect, updateUserProfile)
//Admin deleting users
router.route('/:id').delete(protect,admin,deleteUser)

export default router