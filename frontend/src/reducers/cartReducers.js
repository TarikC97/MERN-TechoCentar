import { CART_ADD_ITEM } from "../constants/cartConstants"; 

export const cartReducer = (state={cartItems:[]},action) =>{
    switch(action.type){
        case CART_ADD_ITEM:
            const item = action.payload

            const existItem = state.cartItems.find((el) => el.product === item.product)

            if(existItem){
                return{
                    ...state,
                    cartItems: state.cartItems.map((el)=> el.product === existItem.product ? item : el)
                }
            }
            else{
                return{
                    ...state,
                    cartItems: [...state.cartItems,item]
                }
            }

        default:
            return state
    }

}