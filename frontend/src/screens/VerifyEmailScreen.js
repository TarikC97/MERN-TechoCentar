import React from 'react'
import {useNavigate} from 'react-router-dom'
import {Form,Button} from 'react-bootstrap'
import FormContainer from '../components/FormContainer'
import {useState} from 'react'
import { useDispatch,useSelector } from 'react-redux'
import {verify} from '../actions/userActions'
import Message from '../components/Message'
import Loader from '../components/Loader'

const VerifyEmailScreen = () => {

  const [token,setToken] = useState('')
  const [message,setMessage] = useState(null)

  const dispatch = useDispatch()
  const navigate = useNavigate()

   const userRegister = useSelector(state=>state.userRegister)
   const {loading,error,userInfo} = userRegister

  //console.log(userInfo.data.userId)
    const id = userInfo.data.userId
    const otp = userInfo.data.mailOtp

  const submitForm = (e)=>{
    e.preventDefault()
    dispatch(verify(id,token))
    if(otp !== token){
      setMessage('Wrong code, try again!')
    }
    else{
      navigate('/login')
    }
  }
  
  return <FormContainer>
    <h1>Verify your Email</h1>
    {message && <Message variant='danger'>{message}</Message>}
    {error && <Message variant='danger'>{error}</Message>}
    {loading && <Loader />}
    <Form onSubmit={submitForm}>
        <Form.Group controlId='token'>
            <Form.Label>Insert your Token here:</Form.Label>
            <Form.Control type='string' 
            placeholder='Enter token' 
            value={token}
            onChange={(e)=>setToken(e.target.value)}
            >
          </Form.Control>
      </Form.Group>
      <Button type='submit' variant='primary'>
            Verify
      </Button>
    </Form>
  </FormContainer>
}

export default VerifyEmailScreen
