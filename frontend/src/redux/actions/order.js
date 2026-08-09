import axios from "axios";
import { server } from '../../../server';

//get all orders of user
export const getAllOrdersOfUser = (userId) => async(dispatch) => {
    try{
        dispatch({
            type: "getAllOrdersOfUserRequest",
        });

        const { data } = await axios.get(`${server}/order/get-all-orders/${userId}`, {
            withCredentials: true,
        });

        dispatch({
            type: "getAllOrdersOfUserSuccess",
            payload: data.orders
        })
    }catch(e){
        dispatch({
            type: "getAllOrdersOfUserFailed",
            payload: e.response?.data?.message || e.message,
        })
    }
}

//get all orders of shop
export const getAllOrdersOfShop = (shopId) => async(dispatch) => {
    try{
        dispatch({
            type: "getAllOrdersOfShopRequest",
        });

        const { data } = await axios.get(`${server}/order/get-seller-all-orders/${shopId}`);

        dispatch({
            type: "getAllOrdersOfShopSuccess",
            payload: data.orders
        })
    }catch(e){
        dispatch({
            type: "getAllOrdersOfShopFailed",
            payload: e.response?.data?.message || e.message,
        })
    }
}
