import React,{useState,useEffect} from 'react'
import {Link,useParams,useNavigate} from 'react-router-dom'
import {useDispatch,useSelector} from 'react-redux'
import { Row,Col,Image,ListGroup,Card,Button,ListGroupItem} from 'react-bootstrap'
import { Form ,FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import Rating from '../components/Rating'
import { listProductDetails,createProductReview } from '../actions/productActions'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { PRODUCT_CREATE_REVIEW_RESET } from '../constants/productConstants'
import Meta from '../components/Meta'


const ProductScreen = () => {
    //Setting quantity of products
    const [qty,setQty] = useState(1)
    //Form for new review
    const [rating,setRating] = useState(0)
    const [comment,setComment] = useState('')

    //Returns object with key id and its value
    const {id} = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    //useSelector used for displaying data
    const productDetails = useSelector(state => state.productDetails)
    //Fetching certain part of data.
    const {loading,error,product} = productDetails

    const productReviewCreate = useSelector(state => state.productReviewCreate)
    //Fetching certain part of data.
    const {
        success:successProductReview, 
        error: errorProductReview
    }  = productReviewCreate

    const userLogin = useSelector(state => state.userLogin)
    //Fetching certain part of data.
    const { userInfo }  = userLogin


    useEffect(()=>{
        if(successProductReview){
            alert('Review Submitted!')
            setRating(0)
            setComment('')
            dispatch({type: PRODUCT_CREATE_REVIEW_RESET})

        }
        //Fetching data as page loades
        dispatch(listProductDetails(id))
    },[dispatch,id,successProductReview])

    const addToCartHandler = ()=>{
    //Navigate - used for redirect
    //? - making id optional
    navigate(`/cart/${id}?qty=${qty}`)
    }

    const submitHandler = (e) =>{
        e.preventDefault()
        dispatch(createProductReview(id,{rating,comment}))
    }


    return <>
        <Link className='btn btn-light my-3' 
                to='/'>
            Go Back
        </Link>
        {loading ? <Loader />: error ? <Message variant='danger'>{error}</Message> :(
            <>
            <Meta title={product.name} />
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
        <Row>
            <Col md={6}>
                <h2>Reviews</h2>
                {product.reviews.length === 0 && 
                <Message>No Reviews</Message>}
                <ListGroup variant='flush'>
                    {product.reviews.map(review =>(
                        <ListGroup.Item key={review._id}>
                            <strong>{review.name}</strong>
                            <Rating value={review.rating} />
                            <p>{review.createdAt.substring(0,10)}</p>
                            <p>{review.comment}</p>
                        </ListGroup.Item>
                    ))}
                    <ListGroup.Item>
                        <h2>Write a Customer Review</h2>
                        {errorProductReview && <Message>{errorProductReview}</Message>}
                        {userInfo ? (
                            <Form onSubmit={submitHandler}>
                                <Form.Group controlId='rating'>
                                    <Form.Label>Rating</Form.Label>
                                    <Form.Control
                                    as='select'
                                    value={rating}
                                    onChange={(e)=>setRating(e.target.value)}
                                    >
                                    <option value=''>Select...</option>
                                    <option value='1'>1 - Poor</option>
                                    <option value='2'>2 - Fair</option>
                                    <option value='3'>3 - Good</option>
                                    <option value='4'>4 - Very Good</option>
                                    <option value='5'>5 - Excellent </option>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId='comment'>
                                    <Form.Label>Comment</Form.Label>
                                    <Form.Control
                                        as='textarea'
                                        row='3'
                                        value={comment}
                                        onChange={(e)=> setComment(e.target.value)}
                                    ></Form.Control>
                                </Form.Group>
                                <Button type='submit' variant='primary'>
                                    Submit
                                </Button>
                            </Form>
                        )  : 
                        <Message>Please <Link to='/login'>
                        sign in</Link>to write a review</Message>}
                    </ListGroup.Item>
                </ListGroup>
            </Col>
        </Row>
        </>
        )}
    </>
}

export default ProductScreen