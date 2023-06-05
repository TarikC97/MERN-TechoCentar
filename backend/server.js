import express from 'express'
import dotenv from 'dotenv'
import connectDB from './database/db.js'
import path from 'path'
import colors from 'colors'
import { notFound,errorHandler } from './middleware/errorMiddleware.js'
import productRouters from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import morgan from 'morgan'

dotenv.config()

connectDB()

const app = express()

//Morgan - Console logs route ,status and time.
// if(process.env.NODE_ENV === 'development'){
//     app.use(morgan('dev'))
// }

//Middleware for fetching user from postman
app.use(express.json())


app.use('/api/products', productRouters)
app.use('/api/users', userRoutes)
app.use('/api/orders',orderRoutes)
app.use('/api/upload',uploadRoutes)

//Making upload folder static so it can get loaded in Browser
const __dirname = path.resolve()
app.use('/uploads',express.static(path.join(__dirname,'/uploads')))

//Fetching Paypal client id (env)
app.get('/api/config/paypal',(req,res)=> res.send(process.env.PAYPAL_CLIENT_ID))

//Production side
 if(process.env.NODE_ENV === 'production'){
    //Setting frontend/build/index.html as static folder
    app.use(express.static(path.join(__dirname,'/frontend/build')))
    //Getting anything except api routes above
    app.get('*',(req,res)=> res.sendFile(path.resolve
        (__dirname,'frontend','build','index.html')))
}
// else{
//     app.get('/',(req,res)=>{
//         res.send('API is running...')
//     })
// }
//Middleware for 404 errors
app.use(notFound)
//Middleware for errors handlers
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on ${PORT}`.yellow.bold))

