import express from "express";
import multer from 'multer'
import path from 'path'
const router = express.Router()

const storage = multer.diskStorage({
    destination(req,file,cb){
        cb(null,'uploads/')
    },
    filename(req,file,cb){
        cb(null,`${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
    },
})
//Getting img file type of jpeg,jpg,png
function checkFileType(file,cb){
    //Return true if it is right type of file,else false.
    const filetypes = /jpg|jpeg|png/
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = filetypes.test(file.mimetype)

    if(extname && mimetype){
        return cb(null,true)
    }
    else{
        cb('Images only!')
    }
}

const upload = multer({
    storage,
    fileFilter: function(req,file,cb){
        checkFileType(file,cb)
    }
})
//api/uploads/ - connected
//image name - in frontend
router.post('/',upload.single('image'),(req,res)=>{
    res.send(`/${req.file.path}`)
})

export default router