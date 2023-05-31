import express from "express";
import { addOrderItems,getOrderById,updateOrderToPaid,getMyOrders,getOrders } from '../controllers/orderController.js'
import {protect,admin} from '../middleware/authMiddleware.js'

const router = express.Router()

//After order returns to api/orders

//Protect - Needed for safe user auth(token)(/orders)
router.route('/')
.post(protect, addOrderItems)
.get(protect,admin,getOrders)
//Geting users orders
router.route('/myorders').get(protect,getMyOrders)
//Needs to at bottom of code /:id(orders/id)
router.route('/:id').get(protect, getOrderById)
//Return id of paid order through paypal
router.route('/:id/pay').put(protect,updateOrderToPaid)

export default router