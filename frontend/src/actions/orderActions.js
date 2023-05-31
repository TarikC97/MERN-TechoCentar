import { ORDER_CREATE_REQUEST,ORDER_CREATE_SUCCESS,ORDER_CREATE_FAIL, ORDER_DETAILS_FAIL, ORDER_DETAILS_SUCCESS, ORDER_DETAILS_REQUEST, ORDER_PAY_FAIL, ORDER_PAY_SUCCESS, ORDER_PAY_REQUEST, ORDER_LIST_MY_REQUEST, ORDER_LIST_MY_SUCCESS, ORDER_LIST_MY_FAIL, ORDER_LIST_REQUEST, ORDER_LIST_SUCCESS, ORDER_LIST_FAIL, ORDER_DELIVER_SUCCESS, ORDER_DELIVER_REQUEST, ORDER_DELIVER_FAIL} from '../constants/orderConstants'
import axios from 'axios'

//We need getState to get token from user.
export const createOrder = (order) => async(dispatch,getState) =>{
    try {
        dispatch({
            type: ORDER_CREATE_REQUEST
        })

        const {userLogin:{userInfo}} = getState()

        //When we are sending data we want to send in headers
        //content-type app/json
        const config = {
            headers:{
                //Needed for POST
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        }
        //Making request in the headers.
        const {data} = await axios.post(`/api/orders`,order,config)

        //Getting user data
        dispatch({
            type: ORDER_CREATE_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type: ORDER_CREATE_FAIL,
            payload: error.response && 
                error.response.data.message ? error.response.data.message :
                error.message
        })
    }
}
//We need getState to get token from user.
export const getOrderDetails = (id) => async(dispatch,getState) =>{
    try {
        dispatch({
            type: ORDER_DETAILS_REQUEST
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
        const {data} = await axios.get(`/api/orders/${id}`,config)

        //Getting user data
        dispatch({
            type: ORDER_DETAILS_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type: ORDER_DETAILS_FAIL,
            payload: error.response && 
                error.response.data.message ? error.response.data.message :
                error.message
        })
    }
}

//We need getState to get token from user.
export const payOrder = (orderId,paymentResult) => async(dispatch,getState) =>{
    try {
        dispatch({
            type: ORDER_PAY_REQUEST
        })

        const {userLogin:{userInfo}} = getState()

        //When we are sending data we want to send in headers
        //content-type app/json
        const config = {
            headers:{
                //We need Content-Type when we are sending data.
                'Content-Type': 'application/json', 
                Authorization: `Bearer ${userInfo.token}`
            }
        }
        //Making request in the headers.
        //Sending paymentResult
        const {data} = await axios.put(`/api/orders/${orderId}/pay`,paymentResult,config)

        //Getting user data
        dispatch({
            type: ORDER_PAY_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type: ORDER_PAY_FAIL,
            payload: error.response && 
                error.response.data.message ? error.response.data.message :
                error.message
        })
    }
}

//We need getState to get token from user.
export const deliverOrder = (order) => async(dispatch,getState) =>{
    try {
        dispatch({
            type: ORDER_DELIVER_REQUEST
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
        //Just fetching id of order.
        const {data} = await axios.put(`/api/orders/${order._id}/deliver`,{},config)

        //Getting user data
        dispatch({
            type: ORDER_DELIVER_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type: ORDER_DELIVER_FAIL,
            payload: error.response && 
                error.response.data.message ? error.response.data.message :
                error.message
        })
    }
}

//We need getState to get token from user.
export const listMyOrders = () => async(dispatch,getState) =>{
    try {
        dispatch({
            type: ORDER_LIST_MY_REQUEST
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
        const {data} = await axios.get(`/api/orders/myorders`,config)

        //Getting user data
        dispatch({
            type: ORDER_LIST_MY_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type: ORDER_LIST_MY_FAIL,
            payload: error.response && 
                error.response.data.message ? error.response.data.message :
                error.message
        })
    }
}

//We need getState to get token from user.(As Admins)
export const listOrders = () => async(dispatch,getState) =>{
    try {
        dispatch({
            type: ORDER_LIST_REQUEST
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
        const {data} = await axios.get(`/api/orders`,config)

        //Getting user data
        dispatch({
            type: ORDER_LIST_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type: ORDER_LIST_FAIL,
            payload: error.response && 
                error.response.data.message ? error.response.data.message :
                error.message
        })
    }
}