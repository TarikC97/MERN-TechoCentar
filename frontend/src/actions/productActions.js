import {
    PRODUCT_LIST_REQUEST,
    PRODUCT_LIST_SUCCESS,
    PRODUCT_LIST_FAIL,
    PRODUCT_DETAILS_REQUEST,
    PRODUCT_DETAILS_SUCCESS,
    PRODUCT_DETAILS_FAIL
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