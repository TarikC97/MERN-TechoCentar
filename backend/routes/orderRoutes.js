import express from "express";
import { addOrderItems,getOrderById } from '../controllers/orderController.js'
import {protect} from '../middleware/authMiddleware.js'

const router = express.Router()

//After order returns to api/orders
//Protect - Needed for safe user auth(token)
router.route('/').post(protect, addOrderItems)
//Needs to at bottom of code /:id
router.route('/:id').get(protect, getOrderById)

export default router