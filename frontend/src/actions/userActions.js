import {USER_DELETE_FAIL, USER_DELETE_REQUEST, USER_DELETE_SUCCESS, USER_DETAILS_FAIL, USER_DETAILS_REQUEST, USER_DETAILS_RESET, USER_DETAILS_SUCCESS, USER_LIST_FAIL, USER_LIST_REQUEST, USER_LIST_RESET, USER_LIST_SUCCESS, USER_LOGIN_FAIL, USER_LOGIN_REQUEST, USER_LOGIN_SUCCESS, USER_LOGOUT, USER_REGISTER_FAIL, USER_REGISTER_REQUEST, USER_REGISTER_SUCCESS, USER_UPDATE_FAIL, USER_UPDATE_PROFILE_FAIL, USER_UPDATE_PROFILE_REQUEST, USER_UPDATE_PROFILE_SUCCESS, USER_UPDATE_REQUEST, USER_UPDATE_SUCCESS, USER_VERIFY_FAIL, USER_VERIFY_REQUEST, USER_VERIFY_SUCCESS} from '../constants/userConstants'
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
    localStorage.removeItem('cartItems')
    localStorage.removeItem('shippingAddress')
    localStorage.removeItem('paymentMethod')
    dispatch({
        type:USER_LOGOUT
    })
    dispatch({
        type:USER_DETAILS_RESET
    })
    dispatch({
        type:ORDER_LIST_MY_RESET
    })
    dispatch({
        type: USER_LIST_RESET
    })
    document.location.href = '/login'
}

export const register = (name,email,password,verified) => async(dispatch) =>{
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
        const {data} = await axios.post('/api/users',{name,email,password,verified},config)

        //Getting user data
        dispatch({
            type: USER_REGISTER_SUCCESS,
            payload: data
        })
        //Login user, as he's register
        // dispatch({
        //     type: USER_LOGIN_SUCCESS,
        //     payload: data
        // })
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
//Verifying mail
export const verify = (otp) => async(dispatch) =>{
    try {
        dispatch({
            type: USER_VERIFY_REQUEST
        })
        //When we are sending data we want to send in headers
        //content-type app/json
        const config = {
            headers:{
                'Content-Type': 'application/json'
            }
        }
        //Making request in the headers.
        const {data} = await axios.post(`/api/users/verify`,{otp},config)

        //Getting user data
        dispatch({
            type: USER_VERIFY_SUCCESS,
            payload: data
        })
        //Saving user in localStorage
        localStorage.setItem('userId',JSON.stringify(data))

    } catch (error) {
        dispatch({
            type: USER_VERIFY_FAIL,
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
                // 'Content-Type': 'application/json',
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
        const message =
        error.response && error.response.data.message
            ? error.response.data.message
            : error.message
    if (message === 'Not authorized, token failed') {
        dispatch(logout())
      }
    dispatch({
      type: USER_DETAILS_FAIL,
      payload: message,
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
        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: data,
          })
    localStorage.setItem('userInfo', JSON.stringify(data))
    } catch (error) {
      const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    if (message === 'Not authorized, token failed') {
      dispatch(logout())
    }
        dispatch({
        type: USER_UPDATE_PROFILE_FAIL,
        payload: message,
        })
    }
}

//We need getState to get token from user.
export const listUsers = () => async(dispatch,getState) =>{
    try {
        dispatch({
            type: USER_LIST_REQUEST
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
        const {data} = await axios.get('/api/users',config)

        //Getting user data
        dispatch({
            type: USER_LIST_SUCCESS,
            payload: data
        })
    } catch (error) {
        const message =
        error.response && error.response.data.message
            ? error.response.data.message
            : error.message
    if (message === 'Not authorized, token failed') {
      dispatch(logout())
    }
        dispatch({
        type: USER_LIST_FAIL,
        payload: message,
        })
    }
}

//We need getState to get token from user.
export const deleteUser = (id) => async(dispatch,getState) =>{
    try {
        dispatch({
            type: USER_DELETE_REQUEST
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
        await axios.delete(`/api/users/${id}`,config)

        //Getting user data
        dispatch({
            type: USER_DELETE_SUCCESS,
        })
    } catch (error) {
        const message =
        error.response && error.response.data.message
            ? error.response.data.message
            : error.message
    if (message === 'Not authorized, token failed') {
        dispatch(logout())
    }
      dispatch({
        type: USER_DELETE_FAIL,
        payload: message,
        })
    }
}

//We need getState to get token from user.
//Passing whole user object(updating all properties of object)
export const updateUser = (user) => async(dispatch,getState) =>{
    try {
        dispatch({
            type: USER_UPDATE_REQUEST
        })

        const {userLogin:{userInfo}} = getState()

        //When we are sending data we want to send in headers
        //content-type app/json
        const config = {
            headers:{
                'Content-type':'application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        }
        //Making request in the headers.
       const {data} = await axios.put(`/api/users/${user._id}`,user,config)

        //Updating user data
        dispatch({
            type: USER_UPDATE_SUCCESS,
        })
        //Dispaying updated user data
        dispatch({
            type: USER_DETAILS_SUCCESS,
            payload: data
        })
        dispatch({ type: USER_DETAILS_RESET })
    } catch (error) {
        const message =
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        if (message === 'Not authorized, token failed') {
            dispatch(logout())
        }
        dispatch({
        type: USER_UPDATE_FAIL,
        payload: message,
        })
    }
}
