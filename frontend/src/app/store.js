import { configureStore } from "@reduxjs/toolkit";
import productReducer from "../features/products/productSlice";
import cartReducer from "../features/cart/cartSlice";
import authReducer from "../features/auth/authSlice";
import orderReducer from "../features/orders/orderSlice";

export default configureStore({
  reducer: {
    productList: productReducer,
    cart: cartReducer,
    auth: authReducer,
    order: orderReducer,
  },
});
