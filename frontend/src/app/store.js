import { configureStore } from "@reduxjs/toolkit";
import productReducer from "../features/productSlice";
import cartReducer from "../features/cartSlice";

export default configureStore({
  reducer: {
    productList: productReducer,
    cart: cartReducer,
  },
});
