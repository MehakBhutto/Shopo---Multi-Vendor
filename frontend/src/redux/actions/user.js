import axios from "axios";
import { server } from "../../../server";

// load user
export const loadUser = () => async (dispatch) => {
    try {
        dispatch({
            type: "LoadUserRequest",
        });
        const { data } = await axios.get(`${server}/user/getuser`, { withCredentials: true });
        dispatch({
            type: "LoadUserSuccess",
            payload: data.user,
        })
    } catch (e) {
        dispatch({
            type: "LoadUserFall",
            payload: e.response?.data?.message || e.message,
        })
    }
}

// load seller
export const loadSeller = () => async (dispatch) => {
    try {
        dispatch({
            type: "LoadSellerRequest",
        });
        const { data } = await axios.get(`${server}/shop/getSeller`, { withCredentials: true });
        dispatch({
            type: "LoadSellerSuccess",
            payload: data.seller,
        })
    } catch (e) {
        dispatch({
            type: "LoadSellerFall",
            payload: e.response?.data?.message || e.message,
        })
    }
}

//update user information
export const updateUserInformation = (name, email, phoneNumber, password) => async (dispatch) => {
    try {
        dispatch({
            type: "updateUserInfoRequest",
        });
        const { data } = await axios.put(`${server}/user/update-user-info`, {
            name,
            email,
            phoneNumber,
            password,
        }, {
            withCredentials: true
        });

        dispatch({
            type: "updateUserInfoSuccess",
            payload: data.user,
        });

    } catch (e) {
        dispatch({
            type: "updateUserInfoFailure",
            payload: e.response?.data?.message || e.message,
        })
    }
}

//update user address
export const updateUserAddress = (address1, address2, city, country, zipCode, addressType) => async (dispatch) => {
    try {
        dispatch({
            type: "updateUserAddressesRequest",
        });

        const { data } = await axios.put(`${server}/user/update-user-addresses`, {
            country,
            city,
            address1,
            address2,
            zipCode,
            addressType
        }, {
            withCredentials: true
        });

        dispatch({
            type: "updateUserAddressesSuccess",
            payload: data.user,
        });

    } catch (e) {
        dispatch({
            type: "updateUserAddressesFailure",
            payload: e.response?.data?.message || e.message,
        })
    }
}

//delete user address
export const deleteUserAddress = (id) => async (dispatch) => {
    try{

        dispatch({
            type: "deleteUserAddressRequest",
        });

        const { data } = await axios.delete(`${server}/user/delete-user-addresses/${id}`, {
            withCredentials: true
        });

        dispatch({
            type: "deleteUserAddressSuccess",
            payload: data.user,
        });

    }catch(e){
        dispatch({
            type: "deleteUserAddressFailed",
            payload: e.response?.data?.message || e.message,
        })
    }
}