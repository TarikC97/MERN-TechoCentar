import express from 'express'
import dotenv from 'dotenv'
import connectDB from './database/db.js'
import colors from 'colors'
import productRouters from './routes/productRoutes.js'
import { notFound,errorHandler } from './middleware/errorMiddleware.js'

dotenv.config()

connectDB()

const app = express()

app.get('/',(req,res)=>{
    res.send('API is running...')
})

app.use('/api/products', productRouters)

//Middleware for 404 errors
app.use(notFound)

//Middleware for errors handlers
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on ${PORT}`.yellow.bold))

