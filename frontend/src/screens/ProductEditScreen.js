import React,{useState,useEffect} from 'react'
import {Link,useNavigate,useParams} from 'react-router-dom'
import {Form,Button} from 'react-bootstrap'
import { useDispatch,useSelector} from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { listProductDetails,updateProduct } from '../actions/productActions'
import FormContainer from '../components/FormContainer'
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants'
import axios from 'axios'


const ProductEditScreen = () => {

  const {id} = useParams()
  const navigate = useNavigate()

  const [name,setName] = useState('')
  const [price,setPrice] = useState(0)
  const [image,setImage] = useState('')
  const [brand,setBrand] = useState('')
  const [category,setCategory] = useState('')
  const [countInStock,setCountInStock] = useState(0)
  const [description,setDescription] = useState('')
  const [uploading,setUploading] = useState(false)

  const dispatch = useDispatch()

  const productDetails = useSelector(state =>state.productDetails)
  const {loading,error,product} = productDetails

  const productUpdate = useSelector(state =>state.productUpdate)
  const {
    loading:loadingUpdate,
    error: errorUpdate,
    success: successUpdate} = productUpdate

  useEffect(()=>{
    //If product is updated
    if(successUpdate){
        dispatch({type: PRODUCT_UPDATE_RESET})
        navigate('/admin/productlist')
    }
    else{
        //If product is not updated, just show product.
        //If product doesnt exist or id in db doesnt match db in url
     if(!product.name || product._id !== id){
        //then get product
          dispatch(listProductDetails(id))
        }
        else{
              //If product exists show the product data
              setName(product.name)
              setPrice(product.price)
              setImage(product.image)
              setBrand(product.brand)
              setCategory(product.category)
              setCountInStock(product.CountInStock)
              setDescription(product.description)
          }
    }
  },[dispatch,product,id,successUpdate,navigate])

  const uploadFileHandler = async (e) =>{
    //.files(array) - files[0] upload one img only
     const file = e.target.files[0]
     const formData = new FormData()
     //image , backend name
     formData.append('image',file)
     setUploading(true)
     try {
       const config = {
         headers:{
           'Content-Type':'multipart/form-data'
         }
       }
       const {data} = await axios.post('/api/upload',formData,config)
       //setImage(path)
       setImage(data)
       setUploading(false)
     } catch (error) {
         console.error(error)
         setUploading(false)
   }
}

  const submitHandler = (e) =>{
    //So the page doesnt refresh
    e.preventDefault()
    //Update Product on submit
    dispatch(updateProduct({
        _id: id,
        name,
        price,
        image,
        brand,
        category,
        countInStock,
        description,
    }))
  }

  return(
  <>
    <Link to='/admin/productlist' className='btn btn-light my-3'>
        Go Back
    </Link>
    <FormContainer>
        <h1>Edit Product</h1>
        {loadingUpdate && <Loader />}
        {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
        {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> :(
          <Form onSubmit={submitHandler}>
            <Form.Group controlId='name'>
                <Form.Label>Name:</Form.Label>
                <Form.Control type='name' 
                placeholder='Enter name' 
                value={name}
                onChange={(e)=>setName(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <Form.Group controlId='price'>
                <Form.Label>Price </Form.Label>
                <Form.Control type='number' 
                placeholder='Enter price' 
                value={price}
                onChange={(e)=>setPrice(e.target.value)}
                ></Form.Control>
              </Form.Group>

            <Form.Group controlId='image'>
              <Form.Label>Image</Form.Label>
                <Form.Control type='text' 
                placeholder='Enter image url' 
                value={image}
                onChange={(e)=>setImage(e.target.value)}
                >
                </Form.Control>
               <Form.Control
                type='file'
                // id='image-file' 
                label='Choose File'
                onChange={uploadFileHandler}></Form.Control>
                {uploading && <Loader />}
              </Form.Group>

              <Form.Group controlId='brand'>
              <Form.Label>Brand</Form.Label>
                <Form.Control type='text' 
                placeholder='Enter brand' 
                value={brand}
                onChange={(e)=>setBrand(e.target.value)}
                >
                </Form.Control>
              </Form.Group>

              <Form.Group controlId='category'>
              <Form.Label>Category</Form.Label>
                <Form.Control type='text' 
                placeholder='Enter category' 
                value={category}
                onChange={(e)=>setCategory(e.target.value)}
                >
                </Form.Control>
              </Form.Group>

              <Form.Group controlId='countInStock'>
              <Form.Label>Count In Stock</Form.Label>
                <Form.Control type='number' 
                placeholder='Count In Stock'
                value={countInStock}
                onChange={(e)=>setCountInStock(e.target.value)}
                >
                </Form.Control>
              </Form.Group>

              <Form.Group controlId='description'>
              <Form.Label>Description</Form.Label>
                <Form.Control type='text' 
                placeholder='Enter description' 
                value={description}
                onChange={(e)=>setDescription(e.target.value)}
                >
                </Form.Control>
              </Form.Group>
              <Button type='submit' variant='primary'>
                Update
              </Button>
            </Form>
        )}
    </FormContainer>
  </>
  )
}

export default ProductEditScreen