import {USER_DETAILS_FAIL, USER_DETAILS_REQUEST, USER_DETAILS_RESET, USER_DETAILS_SUCCESS, USER_LOGIN_FAIL, USER_LOGIN_REQUEST, USER_LOGIN_SUCCESS, USER_LOGOUT, USER_REGISTER_FAIL, USER_REGISTER_REQUEST, USER_REGISTER_SUCCESS, USER_UPDATE_PROFILE_FAIL, USER_UPDATE_PROFILE_REQUEST, USER_UPDATE_PROFILE_SUCCESS} from '../constants/userConstants'
import axios from 'axios'
import { ORDER_LIST_MY_RESET} from '../constants/orderConstants'

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

export const logout = () => (dispatch)=>{
    localStorage.removeItem('userInfo')
    dispatch({
        type:USER_LOGOUT
    })
    dispatch({
        type:USER_DETAILS_RESET
    })
    dispatch({
        type:ORDER_LIST_MY_RESET
    })
}

export const register = (name,email,password) => async(dispatch) =>{
    try {
        dispatch({
            type: USER_REGISTER_REQUEST
        })
        //When we are sending data we want to send in headers
        //content-type app/json
        const config = {
            headers:{
                'Content-Type': 'application/json'
            }
        }
        //Making request in the headers.
        const {data} = await axios.post('/api/users',{name,email,password},config)

        //Getting user data
        dispatch({
            type: USER_REGISTER_SUCCESS,
            payload: data
        })
        //Login user, as he's register
        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: data
        })
        //Saving user in localStorage
        localStorage.setItem('userInfo',JSON.stringify(data))

    } catch (error) {
        dispatch({
            type: USER_REGISTER_FAIL,
            payload: error.response && 
                error.response.data.message ? error.response.data.message :
                error.message
        })
    }
}
//We need getState to get token from user.
export const getUserDetails = (id) => async(dispatch,getState) =>{
    try {
        dispatch({
            type: USER_DETAILS_REQUEST
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
        const {data} = await axios.get(`/api/users/${id}`,config)

        //Getting user data
        dispatch({
            type: USER_DETAILS_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type: USER_DETAILS_FAIL,
            payload: error.response && 
                error.response.data.message ? error.response.data.message :
                error.message
        })
    }
}

//We need getState to get token from user.
export const updateUserProfile = (user) => async(dispatch,getState) =>{
    try {
        dispatch({
            type: USER_UPDATE_PROFILE_REQUEST
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
        const {data} = await axios.put(`/api/users/profile`,user,config)

        //Getting user data
        dispatch({
            type: USER_UPDATE_PROFILE_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type: USER_UPDATE_PROFILE_FAIL,
            payload: error.response && 
                error.response.data.message ? error.response.data.message :
                error.message
        })
    }
}


