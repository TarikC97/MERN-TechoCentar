import axios from 'axios'
import { CART_ADD_ITEM,CART_REMOVE_ITEM } from '../constants/cartConstants'

//Saving our entire cart to local storage - thats why we use getState.
export const addToCart = (id, qty) => async(dispatch,getState) => {
    //Sending request to the server
    const {data} = await axios.get(`/api/products/${id}`)
    //Fetching data from server through payload
    dispatch({
        type: CART_ADD_ITEM,
        payload:{
            product: data._id,
            name: data.name,
            image: data.image,
            price: data.price,
            countInStock: data.countInStock,
            qty
        }
    })
    //Saving entire cart in Storage - Get state(Only saves string in localSTORAGE)
    localStorage.setItem('cartItems',JSON.stringify(getState().cart.cartItems))
}

//GetState- Getting items from localStorage
export const removeFromCart = (id) => async(dispatch,getState) => {
    //Sending request to the server
    const {data} = await axios.get(`/api/products/${id}`)
    //Fetching data from server through payload
    dispatch({
        type: CART_REMOVE_ITEM,
        payload: id
    })
    //Saving entire cart in Storage - Get state(Only saves string in localSTORAGE)
    localStorage.setItem('cartItems',JSON.stringify(getState().cart.cartItems))
}


