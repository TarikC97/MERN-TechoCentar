import React,{useEffect} from 'react'
import {useDispatch,useSelector} from 'react-redux'
import Message from '../components/Message'
import {Row,Col,ListGroup,Image,Form,Button,Card, ListGroupItem} from 'react-bootstrap'
import { addToCart } from '../actions/cartActions'
import {Link,useParams,useNavigate, useSearchParams} from 'react-router-dom'

//Location argument(quantity)
const CartScreen = () => {
    const {id} = useParams()
    const navigate = useNavigate()
    // console.log(id)
    const [qtySearch,setQtySearch] = useSearchParams()
    const qtyNum = Number(qtySearch.get('qty'))
    // console.log(typeof(qtySearch.get('qty')))
    // console.log(typeof(qtyNum))
    const dispatch = useDispatch()

     const cart = useSelector(state => state.cart)
     const {cartItems} = cart
     console.log(cartItems)

     useEffect(()=>{
       if(id){
         dispatch(addToCart(id,qtyNum))
      }
   },[dispatch,id,qtyNum])

   const removeFromCartHandler = (id) =>{
      console.log('remove')
   }
   const checkoutHandler =()=>{
    //IF not login, goes to login else:
    //If logged in , goes to shipping.
    navigate('/login?redirect=shipping')
   }

  return <Row>
    <Col md={8}>
      <h1>Shopping Cart</h1>
      {cartItems.length === 0 ? 
      <Message>Your cart is empty
        <Link to='/'>Go Back</Link>
      </Message> :(
        <ListGroup variant='flush'>
          {cartItems.map((item) => (
            <ListGroupItem key={item.product}>
                <Row>
                  <Col md={2}>
                    <Image src={item.image} alt={item.name} fluid rounded />
                  </Col>
                  <Col md={3}>
                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                  </Col>
                  <Col md={2}>
                    ${item.price}
                  </Col>
                  <Col md={2}>
                    <Form.Control 
                      as='select' 
                      value={item.qty}
                      //Dispatch cause its an Action
                      onChange={(e)=> dispatch(addToCart(item.product,Number(e.target.value)))}>
                      {
                        [...Array(item.countInStock).keys()].map((el) => (
                          <option key={el+1} value={el+1}>
                                {el+1}
                            </option>
                            ))
                          }
                      </Form.Control>
                  </Col>
                  <Col md={2}>
                          <Button type='button' variant='light' 
                          onClick={()=> removeFromCartHandler(item.product)}>
                            <i className='fas fa-trash'></i>
                          </Button>
                  </Col>
                </Row>
            </ListGroupItem>
          ))}
        </ListGroup>
      )}
    </Col>
    <Col md={4}>
      <Card>
        <ListGroup variant='flush'>
            <ListGroupItem>
              <h2>Subtotal({cartItems.reduce((acc,item)=> acc+item.qty,0)}) items</h2>
              ${cartItems.reduce((acc,item) => acc+item.qty*item.price,0).toFixed(2)}
            </ListGroupItem>
            <ListGroupItem>
              <Button 
              type='button'
              className='btn-block'
              disabled={cartItems.length===0}
              onClick={checkoutHandler}>
                Proceed To Checkout
              </Button>
            </ListGroupItem>
        </ListGroup>
      </Card>
    </Col>
  </Row>
}

export default CartScreen