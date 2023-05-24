import {USER_LOGIN_FAIL, USER_LOGIN_REQUEST, USER_LOGIN_SUCCESS} from '../constants/userConstants'
import axios from 'axios'

export const login = (email,password) => async(dispatch) =>{
    try {
        dispatch({
            type: USER_LOGIN_REQUEST
        })
        //When we are sending data we want to send in headers
        //content-type app/json
        const config = {
            headers:{
                'Content-Type': 'application/json'
            }
        }
        //Making request in the headers.
        const {data} = await axios.post('/api/users/login',{email,password},config)

        //Getting user data
        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: data
        })
        //Saving user in localStorage
        localStorage.setItem('userInfo',JSON.stringify(data))

    } catch (error) {
        dispatch({
            type: USER_LOGIN_FAIL,
            payload: error.response && 
                error.response.data.message ? error.response.data.message :
                error.message
        })
    }
}