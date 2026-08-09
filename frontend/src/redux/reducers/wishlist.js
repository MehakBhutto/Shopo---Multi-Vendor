import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  wishlist: localStorage.getItem("wishlistItems")
    ? JSON.parse(localStorage.getItem("wishlistItems"))
    : [],
};

export const wishlistReducer = createReducer(initialState, (builder) => {
  builder
    .addCase("addtoWishlist", (state, action) => {
      const item = action.payload;
      const index = state.wishlist.findIndex((i) => i._id === item._id);

      if (index === -1) {
        // Push directly to the array
        state.wishlist.push(item);
      } 
    })
    .addCase("removeFromWishlist", (state, action) => {
      // Find index and remove via splice to mutate properly
      const index = state.wishlist.findIndex((i) => i._id === action.payload);
      if (index !== -1) {
        state.wishlist.splice(index, 1);
      }
    });
});
