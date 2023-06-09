import React,{useState,useEffect} from 'react'
import {Link,useLocation, useNavigate} from 'react-router-dom'
import {Form,Button,Row,Col} from 'react-bootstrap'
import { useDispatch,useSelector} from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { login } from '../actions/userActions'
import FormContainer from '../components/FormContainer'


const LoginScreen = () => {

  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [message,setMessage] = useState(null)

  const navigate = useNavigate()
  const { search } = useLocation();
  const searchparam = new URLSearchParams(search);
  const redirect = searchparam.get('redirect') || '/';

  const dispatch = useDispatch()

  const userLogin = useSelector(state =>state.userLogin)
  const {loading,error,userInfo} = userLogin

  console.log(userInfo)

  useEffect(()=>{
    if(userInfo){
      navigate(redirect)
    }
  },[navigate,redirect,userInfo])


  const submitHandler = (e) =>{
    //So the page doesnt refrese
    e.preventDefault()
    //Dipatch Login as user logs in
    dispatch(login(email,password))
    // if(userInfo.verified === true){
    //   navigate('/')
    // }
    // else{
    //     setMessage('User is not verified!')
    // }
  }

  return <FormContainer>
        <h1>Sign In</h1>
        {message && <Message variant='danger'>{message}</Message>}
        {error && <Message variant='danger'>{error}</Message>}
        {loading && <Loader />}
        <Form onSubmit={submitHandler}>
          <Form.Group controlId='email'>
            <Form.Label>Email Adress</Form.Label>
            <Form.Control type='email' 
            placeholder='Enter email' 
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId='password'>
            <Form.Label>Password</Form.Label>
            <Form.Control type='password' 
            placeholder='Enter password' 
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Button type='submit' variant='primary'>
            Sign In
          </Button>
        </Form>
        <Row className='py-3'>
            <Col>
              New Customer? <Link to={redirect ?`/register/?redirect=${redirect}`:'/register'}>Register here!</Link>
            </Col>
        </Row>
    </FormContainer>
  
}

export default LoginScreen