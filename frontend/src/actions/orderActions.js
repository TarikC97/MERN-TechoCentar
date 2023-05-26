import { ORDER_CREATE_REQUEST,ORDER_CREATE_SUCCESS,ORDER_CREATE_FAIL} from '../constants/orderConstants'
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