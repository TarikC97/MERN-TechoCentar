import { randomBytes } from "crypto";
import express from "express";
import multer from 'multer'
import path from 'path'
const router = express.Router()

const storage = multer.diskStorage({
    destination(req,file,callb){
        callb(null,'uploads/')
    },
    filename(req,file,callb){
        callb(null,`${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
    }
})
//Getting img file type of jpeg,jpg,png
function checkFileType(file,callb){
    //Return true if it is right type of file,else false.
    const filetypes = /jpg|jpeg|png/
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = filetypes.test(file.mimetype)

    if(extname && mimetype){
        return callb(null,true)
    }
    else{
        callb('Images only!')
    }
}

const upload = multer({
    storage,
    fileFilter: function(req,file,callb){
        checkFileType(file,callb)
    }
})
//api/uploads/ - connected
//image name - in frontend
router.post('/',upload.single('image'),(req,res)=>{
    res.send(`/${req.file.path}`)
})

export default router