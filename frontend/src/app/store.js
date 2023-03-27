import { configureStore } from "@reduxjs/toolkit";
import productReducer from "../features/products/productSlice";
import cartReducer from "../features/cart/cartSlice";
import authReducer from "../features/auth/authSlice";

export default configureStore({
  reducer: {
    productList: productReducer,
    cart: cartReducer,
    auth: authReducer,
  },
});
