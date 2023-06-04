import express from "express";
import { addOrderItems,getOrderById,updateOrderToPaid,updateOrderToDelivered,  getMyOrders,getOrders, deleteOrder } from '../controllers/orderController.js'
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
router.route('/:id')
.get(protect, getOrderById)
.delete(protect,admin,deleteOrder)
//Return id of paid order through paypal
router.route('/:id/pay').put(protect,updateOrderToPaid)
//Return id of delivered product
router.route('/:id/deliver').put(protect,admin,updateOrderToDelivered)

export default router