import mongoose from "mongoose";

//Individual rating
const reviewSchema = mongoose.Schema({
    name: {type: String, required:true},
    rating: {type: Number, required:true},
    comment: {type: String, required:true},
    //User is connected to review
    user:{
        //Which user(admin)create which product
         type: mongoose.Schema.Types.ObjectId,
         required: true,
         //Ads relationship between product and user
         ref:'User'
      },
},{
    timestamps:true
})

const productSchema = mongoose.Schema({
    
    user:{
      //Which user(admin)create which product
       type: mongoose.Schema.Types.ObjectId,
       required: true,
       //Ads relationship between product and user
       ref:'User'
    },
    name: {
        type:String,
        required: true
    },
    image: {
        type:String,
        required: true,
    },
    brand: {
        type:String,
        required: true
    },
    category: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    //Average rating
    reviews: [reviewSchema],
    rating: {
        type: Number,
        required: true,
        default: 0
    },
    numReviews: {
        type: Number,
        required: true,
        default: 0
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    countInStock: {
        type: Number,
        required: true,
        default: 0
    },
},{
    timestamps: true
})

const Product = mongoose.model('Product',productSchema)

export default Product