import React,{useEffect} from 'react'
import {useDispatch,useSelector} from 'react-redux'
import {Row,Col} from 'react-bootstrap'
import Product from '../components/Product'
import { listProducts } from '../actions/productActions'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { useParams } from 'react-router-dom'
import Paginate from '../components/Paginate'

const HomeScreen = () => {

const {keyword} = useParams()
const {pageNumber} = useParams() || 1
const dispatch = useDispatch()
//Same name as reducer in store.js
//useSelector used for displaying data
const productList = useSelector(state => state.productList)
//Fetching certain part of data.
const {loading,error,products,page,pages} = productList

useEffect(() => {
  //Fetching data from server using Action.
  dispatch(listProducts(keyword,pageNumber))
}, [dispatch,keyword,pageNumber])


  return (
    <>
        <h1>Latest Products</h1>       
        {loading ? (<Loader />): 
         error ? <Message variant='danger'>{error}</Message> :(
         <>
         <Row>
         {products.map((product) =>(
             //sm-Size of column.
             <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
             </Col>
         ))}
     </Row>
     <Paginate 
        pages={pages} 
        page={page} 
        keyword={keyword ? keyword : ''} />
     </>
       )}
  </>
  )
}

export default HomeScreen