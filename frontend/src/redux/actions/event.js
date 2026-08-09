import axios from "axios";
import { server } from '../../../server.js'

//create event
export const createEvent = (newForm) => async (dispatch) => {
    try{

        dispatch({
            type: "eventCreateRequest"
        });

        const config = {headers: {"Content-Type" : "multipart/form"}};

        const { data } = await axios.post(
            `${server}/event/create-event`,
            newForm,
            config
        );

        dispatch({
            type: "eventCreateSuccess",
            payload: data.event
        })
    } catch (e) {
        dispatch({
            type: "eventCreateFail",
            payload: e.response?.data?.message || e.response?.data?.messages || e.message
        })
    }
}

//get All events
export const getAllEventsShop = (id) => async (dispatch) => {
    try{

        dispatch({
            type: "getAllEventShopRequest",
        });

        const { data } = await axios.get(`${server}/event/get-all-events/${id}`);

        dispatch({
            type: "getAllEventShopSuccess",
            payload: data.events
        })

    } catch (e) {
        dispatch({
            type: "getAllEventShopFailed",
            payload: e.response?.data?.message || e.response?.data?.messages || e.message
        })
    }
};

export const deleteEvent = (id) => async (dispatch) => {
    try{

        dispatch({
            type: "deleteEventRequest",
        })

        const { data } = await axios.delete(`${server}/event/delete-shop-event/${id}`, {withCredentials: true});
        
        dispatch({
            type: "deleteEventSuccess",
            payload: data.message,
        });
    }catch(e){
        dispatch({
            type: "deleteEventFailed",
            payload: e.response?.data?.message || e.response?.data?.messages || e.message
        })
    }
}

export const getAllEvents = () => async (dispatch) => {
    try{

        dispatch({
            type: "getAllEventRequest",
        });

        const { data } = await axios.get(`${server}/event/get-all-events`);

        dispatch({
            type: "getAllEventSuccess",
            payload: data.events
        })

    } catch (e) {
        dispatch({
            type: "getAllEventFailed",
            payload: e.response?.data?.message || e.response?.data?.messages || e.message
        })
    }
};