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

//@description Delete a product
//@route Delete /api/products/:id
//@access Private/Admin
const deleteProduct= asyncHandler(async(req,res)=>{
    const product = await Product.findById(req.params.id)
    if(product){
       await Product.deleteOne({_id: product._id})
       res.json({message:'Product removed'})
    }
    else{
        //Without status 404, its 500 by default
        res.status(404)
        throw new Error('Product not found')
    }
})

//@description Create a product
//@route Post/api/products
//@access Private/Admin
const createProduct= asyncHandler(async(req,res)=>{
   const product = new Product({
    name:'Sample name',
    price: 0,
    user: req.user._id,
    image:'/images/sample.jpg',
    brand:'Sample brand',
    category: 'Sample category',
    countInStock: 0,
    numReviews: 0,
    description: 'Sample description'
   })
   const createdProduct = await product.save()

   res.status(201).json(createdProduct)
})

//@description Update a product
//@route Put/api/products/:id
//@access Private/Admin
const updateProduct= asyncHandler(async(req,res)=>{
    const {
        name,
        price,
        description,
        image,
        brand,
        category,
        countInStock
    } = req.body

    const product = await Product.findById(req.params.id)

    if(product){
        product.name = name
        product.price = price
        product.description = description
        product.image = image
        product.brand = brand
        product.category = category
        product.countInStock = countInStock
        
    const updatedProduct = await product.save()
    res.json(updatedProduct)
    }
    else{
        res.status(404)
        throw new Error('Product not Found')
    }
 })


//@description Create a new Review
//@route Post/api/products/:id/reviews
//@access Private
const createProductReview = asyncHandler(async(req,res)=>{
    const {
        rating,
        comment
    } = req.body

    const product = await Product.findById(req.params.id)

    if(product){
        const alreadyReviewed = 
         product.reviews
        .find(rev => rev.user.toString() === req.user._id.toString())
        if(alreadyReviewed){
            res.status(400)
            throw new Error('Product already Reviewed')
        }
        //Creating object 
        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id
        }
        product.reviews.push(review)
        product.numReviews = product.reviews.length
        //Average rating.
        product.rating = 
        product.reviews.reduce((acc,item) => item.rating +acc,0) / product.reviews.length
    
        await product.save()
        res.status(201).json({message: 'Review added'})
    }
    else{
        res.status(404)
        throw new Error('Product not Found')
    }
 })

export{
    getProducts,
    getProductById,
    deleteProduct,
    createProduct,
    updateProduct,
    createProductReview,
}