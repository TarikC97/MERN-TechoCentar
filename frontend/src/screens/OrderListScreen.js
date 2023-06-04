import React,{useEffect} from 'react'
import {LinkContainer} from 'react-router-bootstrap'
import {Table,Button} from 'react-bootstrap'
import { useDispatch,useSelector} from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import {listOrders,deleteOrder} from '../actions/orderActions'
import {useNavigate, useParams} from 'react-router-dom'



const OrderListScreen = () => {

  const navigate = useNavigate()  
  const dispatch = useDispatch()
  const {id} =useParams()

  const orderList = useSelector(state=>state.orderList)
  const {loading:loadingOrder,orders,error:errorOrder} = orderList

  const userLogin = useSelector(state=>state.userLogin)
  const {userInfo} = userLogin

  const orderDelete = useSelector(state=>state.orderDelete)
  const {
        loading:loadingDelete,
        success:successDelete,
        error:errorDelete   } =orderDelete

//   const userList = useSelector(state=>state.userList)
//   const {loading,error,users} = userList

  useEffect(()=>{
    //If admin logged in he can access all users page
    //Else other users cant.
    if(userInfo && userInfo.isAdmin){
        dispatch(listOrders())
    }
    else{
        navigate('/login')
    }
    
  },[dispatch,navigate,userInfo,successDelete])
  
  const deleteHandler = (id)=>{
    if(window.confirm('Are you sure?')){
        dispatch(deleteOrder(id))
    }
  }

  return (
    <> 
      <h1>Orders</h1>
    {loadingDelete && <Loader />}
    {errorDelete && <Message variant='danger'>{errorDelete}</Message> }
    {loadingOrder ? <Loader /> : errorOrder ? <Message variant='danger'>{errorOrder}</Message>:
    (
        <Table striped bordered hover responsive className='table-sm'>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>USER</th>
                    <th>DATE</th>
                    <th>TOTAL</th>
                    <th>PAID</th>
                    <th>DELIVERED</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {orders.map(order=>(
                    <tr key={order._id}>
                        <td>{order._id}</td>
                        <td>{order.user && order.user.name}</td>
                        <td>{order.createdAt.substring(0,10)}</td>
                        <td>${order.totalPrice}</td>
                        <td>
                         {order.paidAt ? (
                            order.paidAt.substring(0,10)
                         ):(
                            <i className='fas fa-times' style={{color:'red'}}></i>
                         )}
                        
                        </td>
                        <td>
                         {order.isDelivered ? (
                            order.deliveredAt.substring(0,10)
                         ):(
                            <i className='fas fa-times' style={{color:'red'}}></i>
                         )}
                        
                        </td>
                        <td>
                            <LinkContainer to={`/order/${order._id}`}>
                                <Button variant='light' className='btn-sm'>
                                    Details
                                </Button>
                            </LinkContainer>
                        </td>
                        <td>
                            <Button variant='danger' 
                                className='btn-sm'
                                onClick={()=>deleteHandler(order._id)}>
                                    <i className='fas fa-trash'></i>
                             </Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    )}
    </>
  )
}

export default OrderListScreen