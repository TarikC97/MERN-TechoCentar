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

dotenv.config()

connectDB()

const app = express()

//Middleware for fetching user from postman
app.use(express.json())

app.get('/',(req,res)=>{
    res.send('API is running...')
})

app.use('/api/products', productRouters)
app.use('/api/users', userRoutes)
app.use('/api/orders',orderRoutes)
app.use('/api/uploads',uploadRoutes)

//Making upload folder static so it can get loaded in Browser
const __dirname = path.resolve()
app.use('/uploads',express.static(path.join(__dirname,'/uploads')))

//Fetching Paypal client id (env)
app.get('/api/config/paypal',(req,res)=> res.send(process.env.PAYPAL_CLIENT_ID))

//Middleware for 404 errors
app.use(notFound)
//Middleware for errors handlers
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on ${PORT}`.yellow.bold))

