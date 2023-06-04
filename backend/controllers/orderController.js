import asyncHandler from 'express-async-handler'
import Order from '../models/orderModel.js'

//@description Create new order
//@route POST /api/orders
//@access Private
const addOrderItems = asyncHandler(async(req,res)=>{
    //Form items in Frontend
    const {
        orderItems,
        shippingAddress, 
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice} = req.body
        //Checking if itemOrders exists
        if(orderItems && orderItems.length === 0){
            res.status(400)
            throw new Error('No order items')
            return
        }
        //Creating a new order
        else{
            //Creating new object of class Order in(db)
            const order = new Order({
                orderItems,
                user: req.user._id,
                shippingAddress, 
                paymentMethod,
                itemsPrice,
                taxPrice,
                shippingPrice,
                totalPrice
            })
            //Saving created order in db
            const createdOrder = await order.save()

            res.status(201).json(createdOrder)
        }


})

//@description Get order by ID
//@route GET /api/orders/:id
//@access Private
const getOrderById = asyncHandler(async(req,res)=>{
    //Fetching order from specific user by id in URL
    //Populate - fetching user name and email by user id
    const order = await Order.findById(req.params.id).populate('user', 'name email')

    if(order){
        res.json(order)
    }
    else{
        res.status(404)
        throw new Error('Order not found')
    }
})

//@description Update order to paid
//@route GET /api/orders/:id/pay
//@access Private
const updateOrderToPaid = asyncHandler(async(req,res)=>{
    //Fetching order from specific user by id in URL
    const order = await Order.findById(req.params.id)

    if(order){
        order.isPaid = true
        order.paidAt = Date.now()
        //Paypal Response
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.payer.email_address 
        }
        const updatedOrder = await order.save()

        res.json(updatedOrder)
    }
    else{
        res.status(404)
        throw new Error('Order not found')
    }
})

//@description Update order to delivered
//@route GET /api/orders/:id/delivered
//@access Private
const updateOrderToDelivered = asyncHandler(async(req,res)=>{
    //Fetching order from specific user by id in URL
    const order = await Order.findById(req.params.id)

    if(order){
        order.isDelivered = true
        order.deliveredAt = Date.now()
        
        const updatedOrder = await order.save()
        res.json(updatedOrder)
    }
    else{
        res.status(404)
        throw new Error('Order not found')
    }
})


//@description Get logged in user orders
//@route GET /api/orders/myorders
//@access Private
const getMyOrders = asyncHandler(async(req,res)=>{
    //Fetching orders from specific user by id in URL
    const orders = await Order.find({user: req.user._id})
    res.json(orders)
})

//@description Get all orders
//@route GET /api/orders
//@access Private/Admin
const getOrders = asyncHandler(async(req,res)=>{
    //Fetching orders from specific user by id in URL
    const orders = await Order.find({}).populate('user','id name')
    res.json(orders)
})
//@description Delete order
//@route Delete /api/orders
//@access Private/Admin
const deleteOrder = asyncHandler(async(req,res)=>{
    const order = await Order.findById(req.params.id)

    if(order){
        await Order.deleteOne({_id: order._id})
        res.json({message:'Order removed'})
    }
    else{
        res.status(404)
        throw new Error('Order not found')
    }

})



export {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDelivered,
    getMyOrders,
    getOrders,
    deleteOrder
}