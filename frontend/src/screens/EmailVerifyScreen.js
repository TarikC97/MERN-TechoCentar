import React, { Fragment } from 'react'
import {Link,useParams} from 'react-router-dom'
import { useState,useEffect } from 'react'
import success from '../../public/images/success'
import axios from 'axios'

const EmailVerifyScreen = () => {

    const [validUrl,setValidUrl] =useState(false)
    const param = useParams()

    useEffect(()=>{
     const verifyEmailUrl = async()=>{
        try {
            const url= `http://localhost:3000/${param.id}/verify/${param.token}`
            const {data} = await axios.get(url)
            console.log(data)
            setValidUrl(true)
        } catch (error) {
            console.log(error)
            setValidUrl(false)
        }
     }
     verifyEmailUrl
},[param])

  return (
    <Fragment>
        {validUrl ?(
            <div className='container'>
                <img 
                src={success} 
                alt="success_img"
                />
                <h1>Email Verified!</h1>
                <Link to='/login'>
                    <button className='green_btn'></button>
                </Link>
            </div>
        ):(
            <h1>This URL is not valid !</h1>
        )}
    </Fragment>
  )
}

export default EmailVerifyScreen