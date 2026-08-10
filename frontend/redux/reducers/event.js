import { createReducer } from '@reduxjs/toolkit';

const initialState = {
    isLoading: true,
}

export const eventReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(
            "eventCreateRequest", (state) => {
                state.isLoading = true;
            }
        )
        .addCase(
            "eventCreateSuccess", (state, action) => {
                state.isLoading = false,
                state.event = action.payload;
                state.success = true;
            }
        )
        .addCase(
            "eventCreateFail", (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.success = false
            }
        )
        .addCase(
            "eventCreateReset", (state) => {
                state.success = false;
                state.event = null;
            }
        )

        //get all events of shop
        .addCase(
            "getAllEventShopRequest", (state) => {
                state.isLoading = true;
            },
        )
        .addCase(
            "getAllEventShopSuccess", (state, action) => {
                state.isLoading = false;
                state.events = action.payload;
            }
        )
        .addCase(
            "getAllEventShopFailed", (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            }
        )

        //get all events
        .addCase(
            "getAllEventRequest", (state) => {
                state.isLoading = true;
            },
        )
        .addCase(
            "getAllEventSuccess", (state, action) => {
                state.isLoading = false;
                state.allevents = action.payload;
            }
        )
        .addCase(
            "getAllEventFailed", (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            }
        )

        //delete event of a shop
        .addCase(
            "deleteEventRequest", (state) => {
                state.isLoading = true;
            }
        )
        .addCase(
            "deleteEventSuccess", (state, action) => {
                state.isLoading = false;
                state.message = action.payload;
            }
        )
        .addCase(
            "deleteEventFailed", (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            }
        )
        .addCase(
            "clearErrors", (state) => {
                state.error = null;
            }
        )
});
