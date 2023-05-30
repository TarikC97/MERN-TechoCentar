import express from "express";
import multer from 'multer'
const router = express.Router()

const storage = multer.diskStorage({
    destination(req,file,callb){
        callb(null,'uploads/')
    }
})


export default router