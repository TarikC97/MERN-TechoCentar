import asyncHandler from 'express-async-handler'
import Product from '../models/productModel.js'

//Instead of fetching products using routes
//We use controllers instead.
//instead of /api/products => /(cause of Router)
//@description Fetch all products
//@route GET /api/products
//@access Public
const getProducts = asyncHandler(async(req,res)=>{
    const products = await Product.find({})
    //throw new Error('Some Error')
    res.json(products)
})

//@description Fetch single product
//@route GET /api/products/:id
//@access Public
const getProductById = asyncHandler(async(req,res)=>{
    const product = await Product.findById(req.params.id)
    if(product){
       res.json(product) 
    }
    else{
        //Without status 404, its 500 by default
        res.status(404)
        throw new Error('Product not found')
    }
})
export{
    getProducts,
    getProductById
}