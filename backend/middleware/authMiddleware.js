import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import AsyncHandler from "express-async-handler";


//Validating Token through Middleware
const protect = AsyncHandler(async(req,res,next) =>{
    let token  

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            //Taking token id without 'Bearer[0] tokenid[1]'
            token = req.headers.authorization.split(' ')[1]
            const decoded = jwt.verify(token,process.env.JWT_SECRET)
            console.log(decoded)
            next()
        } catch (error) {
            
        }
    }
    if(!token){
        res.status(401)
        throw new Error('Not authorized no Token!')
    }
})

export {protect}
