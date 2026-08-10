import axios from "axios";
import { server } from '../../../server.js'

//create product
export const createProduct = (newForm) => async (dispatch) => {
    try{

        dispatch({
            type: "productCreateRequest"
        });

        const config = {headers: {"Content-Type" : "multipart/form"}};

        const { data } = await axios.post(
            `${server}/product/create-product`,
            newForm,
            config
        );

        dispatch({
            type: "productCreateSuccess",
            payload: data.product
        })
    } catch (e) {
        dispatch({
            type: "productCreateFail",
            payload: e.response?.data?.message || e.response?.data?.messages || e.message
        })
    }
}

//get All Products
export const getAllProductsShop = (id) => async (dispatch) => {
    try{

        dispatch({
            type: "getAllProductsShopRequest",
        });

        const { data } = await axios.get(`${server}/product/get-all-products-shop/${id}`);

        dispatch({
            type: "getAllProductsShopSuccess",
            payload: data.products
        })

    } catch (e) {
        dispatch({
            type: "getAllProductsShopFailed",
            payload: e.response?.data?.message || e.response?.data?.messages || e.message
        })
    }
};

export const deleteProduct = (id) => async (dispatch) => {
    try{

        dispatch({
            type: "deleteProductRequest",
        })

        const { data } = await axios.delete(`${server}/product/delete-shop-product/${id}`, {withCredentials: true});
        
        dispatch({
            type: "deleteProductSuccess",
            payload: data.message,
        });
    }catch(e){
        dispatch({
            type: "deleteProductFailed",
            payload: e.response?.data?.message || e.response?.data?.messages || e.message
        })
    }
}

//get all products
export const getAllProducts = () => async (dispatch) => {
    try{

        dispatch({
            type: "getAllProductsRequest",
        });

        const { data } = await axios.get(`${server}/product/get-product`);

        dispatch({
            type: "getAllProductsSuccess",
            payload: data.products
        })

    } catch (e) {
        dispatch({
            type: "getAllProductsFailed",
            payload: e.response?.data?.message || e.response?.data?.messages || e.message
        })
    }
};
