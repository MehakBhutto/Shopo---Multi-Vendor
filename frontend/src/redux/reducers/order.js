import { createReducer } from '@reduxjs/toolkit';

const initialState = {
    isLoading: true,
}

export const orderReducer = createReducer(initialState, (builder) => {
    builder

        //get all order of user
        .addCase(
            "getAllOrdersOfUserRequest", (state) => {
                state.isLoading = true;
            },
        )
        .addCase(
            "getAllOrdersOfUserSuccess", (state, action) => {
                state.isLoading = false;
                state.orders = action.payload;
            }
        )
        .addCase(
            "getAllOrdersOfUserFailed", (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            }
        )

        // get all orders of shop
        .addCase(
            "getAllOrdersOfShopRequest", (state) => {
                state.isLoading = true;
            },
        )
        .addCase(
            "getAllOrdersOfShopSuccess", (state, action) => {
                state.isLoading = false;
                state.orders = action.payload;
            }
        )
        .addCase(
            "getAllOrdersOfShopFailed", (state, action) => {
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
