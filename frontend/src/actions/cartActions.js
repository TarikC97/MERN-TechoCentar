import axios from 'axios'
import { CART_ADD_ITEM } from '../constants/cartConstans'

//Saving our entire cart to local storage - thats why we use getState.
export const addToCart = (id,qty) => async(dispatch,getState)=>{
    const {data} = await axios.get(`api/products/${id}`)

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
    //Saving entire cart - Get state(Only saves string in localSTORAGE)
    localStorage.setItem('cartItems',JSON.stringify(getState().cart.cartItems))
}