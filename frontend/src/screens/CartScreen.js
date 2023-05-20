import React,{useEffect} from 'react'
import {useDispatch,useSelector} from 'react-redux'
import Message from '../components/Message'
import {Row,Col,LisGroup,Image,Form,Button,Card} from 'react-bootstrap'
import { addToCart } from '../actions/cartActions'
import {Link,useParams,useNavigate, useSearchParams} from 'react-router-dom'

//Location argument(quantity)
const CartScreen = () => {
    const {id} = useParams()
    const navigate = useNavigate()
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

  return (
    <div>CartScreen</div>
  )
}

export default CartScreen