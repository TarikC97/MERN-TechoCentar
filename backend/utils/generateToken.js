import jwt from 'jsonwebtoken'

//Taking as arguments userid,Token and Token duration.
const generateToken = (id) =>{
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn: '30d'
    })
}

export default generateToken