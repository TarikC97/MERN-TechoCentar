import { legacy_createStore,combineReducers,applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
import {productListReducer,productDetailsReducer,productDeleteReducer,productCreateReducer,productUpdateReducer,productReviewCreateReducer,productTopRatedReducer} from './reducers/productReducers'
import { cartReducer } from './reducers/cartReducers'
import { userDetailsReducer, userLoginReducer, userRegisterReducer,userVerifyReducer, userUpdateProfileReducer,userListReducer,userDeleteReducer,userUpdateReducer } from './reducers/userReducers'
import {orderCreateReducer,orderDetailsReducer, orderPayReducer,orderDeliverReducer, OrderListMyReducer,OrderListReducer,orderDeleteReducer} from './reducers/orderReducers'


const reducer = combineReducers({
    productList: productListReducer,
    productDetails: productDetailsReducer,
    productDelete: productDeleteReducer,
    productCreate: productCreateReducer,
    productUpdate: productUpdateReducer,
    productReviewCreate: productReviewCreateReducer,
    productTopRated: productTopRatedReducer,
    cart: cartReducer,
    userLogin: userLoginReducer,
    userRegister: userRegisterReducer,
    userVerify: userVerifyReducer,
    userDetails: userDetailsReducer,
    userUpdateProfile: userUpdateProfileReducer,
    userList: userListReducer,
    userDelete: userDeleteReducer,
    userUpdate: userUpdateReducer,
    orderCreate: orderCreateReducer,
    orderDelete: orderDeleteReducer,
    orderDetails: orderDetailsReducer,
    orderPay: orderPayReducer,
    orderDeliver: orderDeliverReducer,
    orderListMy: OrderListMyReducer,
    orderList: OrderListReducer,
})

//Getting Cart Items from LocalStorage(Needs to be String)
const cartItemsFromStorage = localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')): []

//Getting Users data from LocalStorage(Needs to be String)
const userInfoFromStorage = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')): null

//Getting ShippingAdress data from LocalStorage(Needs to be String)
const shippingAddressFromStorage = localStorage.getItem('shippingAddress') ? JSON.parse(localStorage.getItem('shippingAddress')): {}

//Getting userId(with emailToken) from LocalStorage
// const userIdFromStorage = localStorage.getItem('userId') ? JSON.parse(localStorage.getItem('userId')): null

//Getting CartItems
//Getting userData
const initialState = {
    cart: {
        cartItems:cartItemsFromStorage,
        shippingAddress: shippingAddressFromStorage,
    },
    // userVerify: {userId: userIdFromStorage},
    userLogin: {userInfo: userInfoFromStorage},
}
const middleware = [thunk]

const store = legacy_createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
)

export default store
