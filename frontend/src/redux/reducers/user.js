import { createReducer } from "@reduxjs/toolkit";

const initialState = {
    isAuthenticated: false,
    loading: false,
    user: null,
    error: null
};

export const userReducer = createReducer(initialState, (builder) => {
    builder
        .addCase("LoadUserRequest", (state) => {
            state.loading = true;
        })
        .addCase("LoadUserSuccess", (state, action) => {
            state.isAuthenticated = true;
            state.loading = false;
            state.user = action.payload;
        })
        .addCase("LoadUserFall", (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.isAuthenticated = false;
        })

        //update user information
        .addCase("updateUserInfoRequest", (state) => {
            state.loading = true;
        })
        .addCase("updateUserInfoSuccess", (state, action) => {
            state.loading = false;
            state.user = action.payload;
        })
        .addCase("updateUserInfoFailure", (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        
        //update user address
        .addCase("updateUserAddressesRequest", (state) => {
            state.addressLoading = true;
        })
        .addCase("updateUserAddressesSuccess", (state, action) => {
            state.addressLoading = false;
            state.user = action.payload;
        })
        .addCase("updateUserAddressesFailure", (state, action) => {
            state.addressLoading = false;
            state.error = action.payload;
        })

        //delete user address
        .addCase("deleteUserAddressRequest", (state) => {
            state.addressLoading = true;
        })
        .addCase("deleteUserAddressSuccess", (state, action) => {
            state.addressLoading = false;
            state.user = action.payload;
        })
        .addCase("deleteUserAddressFailed", (state, action) => {
            state.addressLoading = false;
            state.error = action.payload;
        })
        .addCase("clearErrors", (state) => {
            state.error = null;
        });
})
