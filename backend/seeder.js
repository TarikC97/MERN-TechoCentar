import mongoose from "mongoose";
import dotenv from 'dotenv'
import colors from 'colors'
import users from "./data/users.js";
import products from "./data/products.js";
import User from './models/userModel.js'
import Product from './models/productModel.js'
import Order from "./models/orderModel.js";
import connectDB from './database/db.js'

//Its separete from the server.js
dotenv.config()
connectDB()
//Dealing with db, needs to be async(returns a promise)

const importData = async () =>{
    try{
        //Deletes all collections from db
        await Order.deleteMany()
        await Product.deleteMany()
        await User.deleteMany()
        //Inserting all custom collections in db
    const createdUsers = await User.insertMany(users)
    const adminUser = createdUsers[0]._id

    const sampleProducts = products.map((product)=>{
        return{...product, user: adminUser}
    })
2
    await Product.insertMany(sampleProducts)

    console.log('Data imported'.green.inverse)
    process.exit()

    }catch(error){
        console.error(`${error}`.red.inverse)
        process.exit(1)
        //Exiting with failure(1)
    }
}
const destroyData = async () =>{
    try{
    //Deletes all collections from db
        await Order.deleteMany()
        await Product.deleteMany()
        await User.deleteMany()

    console.log('Data Destroyed'.green.inverse)
    process.exit()
    }catch(error){
        console.error(`${error}`.red.inverse)
        process.exit(1)
        //Exiting with failure(1)
    }
}
//argv- Array[2] (2 means whatever is passed as third el example:(-d))
if(process.argv[2] === '-d'){
    destroyData()
}else{
    importData()
}