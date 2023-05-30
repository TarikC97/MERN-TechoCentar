import {
    PRODUCT_LIST_REQUEST,
    PRODUCT_LIST_SUCCESS,
    PRODUCT_LIST_FAIL,
    PRODUCT_DETAILS_REQUEST,
    PRODUCT_DETAILS_SUCCESS,
    PRODUCT_DETAILS_FAIL,
    PRODUCT_DELETE_REQUEST,
    PRODUCT_DELETE_FAIL,
    PRODUCT_DELETE_SUCCESS,
    PRODUCT_CREATE_REQUEST,
    PRODUCT_CREATE_SUCCESS,
    PRODUCT_CREATE_FAIL
} from '../constants/productConstants'
import axios from 'axios'
//Action for list of products
export const listProducts = () => async(dispatch)=>{
    //Action(dispatch) = > Reducer
    try {
        dispatch({type:PRODUCT_LIST_REQUEST})
        //Sending request to server.
        const {data} = await axios.get('/api/products')
         //Server response with data through payload
        dispatch({
            type: PRODUCT_LIST_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type: PRODUCT_LIST_FAIL,
            payload: error.response && 
            error.response.data.message ? error.response.data.message :
            error.message
        })
    }
}
//Action for single product
export const listProductDetails = (id) => async(dispatch)=>{
    //Action(dispatch) = > Reducer
    try {
        //Set loading to true
        dispatch({type:PRODUCT_DETAILS_REQUEST})
        //Sending request to server.
        const {data} = await axios.get(`/api/products/${id}`)
        //Server response with data through payload
        dispatch({
            type: PRODUCT_DETAILS_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type: PRODUCT_DETAILS_FAIL,
            payload: error.response && 
            error.response.data.message ? error.response.data.message :
            error.message
        })
    }
}

//We need getState to get token from user.
export const deleteProduct = (id) => async(dispatch,getState) =>{
    try {
        dispatch({
            type: PRODUCT_DELETE_REQUEST
        })

        const {userLogin:{userInfo}} = getState()

        //When we are sending data we want to send in headers
        //content-type app/json
        const config = {
            headers:{
                Authorization: `Bearer ${userInfo.token}`
            }
        }
        //Making request in the headers.
        await axios.delete(`/api/products/${id}`,config)

        //Getting user data
        dispatch({
            type: PRODUCT_DELETE_SUCCESS,
        })
    } catch (error) {
        dispatch({
            type: PRODUCT_DELETE_FAIL,
            payload: error.response && 
                error.response.data.message ? error.response.data.message :
                error.message
        })
    }
}

//We need getState to get token from user.
export const createProduct = () => async(dispatch,getState) =>{
    try {
        dispatch({
            type: PRODUCT_CREATE_REQUEST
        })

        const {userLogin:{userInfo}} = getState()

        //When we are sending data we want to send in headers
        //content-type app/json
        const config = {
            headers:{
                Authorization: `Bearer ${userInfo.token}`
            }
        }
        //Making request in the headers.
        //{} - Post request but not sending data.
        const {data} = await axios.post(`/api/products`,{},config)

        //Getting user data
        dispatch({
            type: PRODUCT_CREATE_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type: PRODUCT_CREATE_FAIL,
            payload: error.response && 
                error.response.data.message ? error.response.data.message :
                error.message
        })
    }
}