import jwt from 'jsonwebtoken'

//Taking as arguments userid,Token and Token duration.
const generateToken = (id) =>{
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn: '60d'
    })
}

export default generateToken