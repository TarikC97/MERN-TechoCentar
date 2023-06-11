import nodemailer from 'nodemailer'

const generateMail = async(email,subject,text)=>{
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.HOST,
            service: process.env.SERVICE,
            port: Number(process.env.EMAIL_PORT),
            secure: Boolean(proccess.env.SECURE),
            auth:{
                user: process.env.USER,
                pass: process.env.PASS,
            }
        })
        await transporter.sendMail({
            from: process.env.USER,
            to:email,
            subject:subject,
            text:text
        })
        console.log("Email sent Succesfully")
    } catch (error) {
        console.log("Email not sent")
        console.log(error)
    }
}
export default generateMail