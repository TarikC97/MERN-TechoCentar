import React from 'react'
import {useNavigate} from 'react-router-dom'
import {Form,Button} from 'react-bootstrap'
import FormContainer from '../components/FormContainer'
import {useState,useEffect} from 'react'
import { useDispatch,useSelector } from 'react-redux'
import {verify} from '../actions/userActions'

const VerifyEmailScreen = () => {

  const [token,setToken] = useState('')

  const dispatch = useDispatch()
  const navigate = useNavigate()

  // const userVerify = useSelector(state=>state.userVerify)
  // const {userId} = userVerify
  
  const userVerify = useSelector(state =>state.userVerify)
  const {userId} = userVerify

  console.log(userId._id)
  // const proba = JSON.parse(localStorage.getItem('userInfo'))
  // console.log(proba)

  // useEffect(()=>{
  //   if(userId){
  //     navigate('/verify')
  //   } 
  // },[userId,navigate])

  const submitForm = (e)=>{
    e.preventDefault()
    dispatch(verify(userId._id,token))
    navigate('/login')
  }
  
  return <FormContainer>
    <h1>Verify your Email</h1>
    <Form onSubmit={submitForm}>
        <Form.Group controlId='token'>
            <Form.Label>Insert your Token here:</Form.Label>
            <Form.Control type='token' 
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
