import React,{useState,useEffect} from 'react'
import {Link,useParams,useNavigate} from 'react-router-dom'
import {useDispatch,useSelector} from 'react-redux'
import { Row,Col,Image,ListGroup,Card,Button,ListGroupItem} from 'react-bootstrap'
import { Form ,FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import Rating from '../components/Rating'
import { listProductDetails } from '../actions/productActions'
import Loader from '../components/Loader'
import Message from '../components/Message'

const ProductScreen = () => {
    //Setting quantity of products
    const [qty,setQty] = useState(1)

    //Returns object with key id and its value
    const {id} = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    //useSelector used for displaying data
    const productDetails = useSelector(state => state.productDetails)
    //Fetching certain part of data.
    const {loading,error,product} = productDetails

    useEffect(()=>{
        //Fetching data as page loades
        dispatch(listProductDetails(id))
},[dispatch,id])

const addToCartHandler = ()=>{
    //Navigate - used for redirect
    //? - making id optional
    navigate(`/cart/${id}?qty=${qty}`)
}
    return <>
        <Link className='btn btn-light my-3' 
                to='/'>
            Go Back
        </Link>
        {loading ? <Loader />: error ? <Message variant='danger'>{error}</Message> :(
            <Row>
            <Col md={6}>
                <Image src={product.image} alt={product.name} fluid />
            </Col>
            <Col md={3}>
                <ListGroup variant='flush'>
                    <ListGroupItem>
                        <h3>{product.name}</h3>
                    </ListGroupItem>
                    <ListGroupItem>
                        <Rating 
                        value={product.rating} 
                        text={`${product.numReviews}`} 
                        />
                    </ListGroupItem>
                     <ListGroupItem>
                        Price: ${product.price}
                    </ListGroupItem>
                    <ListGroupItem>
                        Description: {product.description}
                    </ListGroupItem>
                </ListGroup>
            </Col>
            <Col md={3}>
                <Card>
                    <ListGroup variant='flush'>
                        <ListGroupItem>
                            <Row>
                                <Col>
                                    Price:
                                </Col>
                                <Col>
                                    <strong>
                                        ${product.price}
                                    </strong>
                                </Col>
                            </Row>
                        </ListGroupItem>
                        <ListGroupItem>
                            <Row>
                                <Col>
                                    Status:
                                </Col>
                                <Col>
                                    {product.countInStock > 0 ? 'In Stock': 'Out of Stock'}
                                </Col>
                            </Row>
                        </ListGroupItem>
                        {product.countInStock > 0 &&(
                            <ListGroupItem>
                                <Row>
                                    <Col>Qty</Col>
                                    <Col>
                                        <Form.Control 
                                            as='select' 
                                            value={qty}
                                            onChange={(e)=> setQty(e.target.value)}>
                                          {
                                            [...Array(product.countInStock).keys()].map((el) => (
                                                <option key={el+1} value={el+1}>
                                                    {el+1}
                                                </option>
                                               ))
                                            }
                                        </Form.Control>
                                    </Col>
                                </Row>
                            </ListGroupItem>
                        )}
                        <ListGroupItem>
                           <Button
                           onClick={addToCartHandler} 
                           className='btn-block' 
                           type='button'
                           disabled ={ product.countInStock === 0}>
                                Add to Cart
                           </Button>
                        </ListGroupItem>
                    </ListGroup>
                </Card>
            </Col>
        </Row>
        )}
    </>
}

export default ProductScreen