import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import cartService from "./cartService";

const cartItemsFromStorage = localStorage.getItem("cartItems")
  ? JSON.parse(localStorage.getItem("cartItems"))
  : [];
const shippingAddressFromStorage = localStorage.getItem("shippingAddress")
  ? JSON.parse(localStorage.getItem("shippingAddress"))
  : {};

const initialState = {
  cartItems: cartItemsFromStorage,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
  shippingAddress: shippingAddressFromStorage,
  paymentMethod: "paypal",
  itemsPrice: 0,
  shippingPrice: 0,
  taxPrice: 0,
  totalPrice: 0,
};

export const cartAddItems = createAsyncThunk(
  "cartItems/CART_ADD_ITEM",
  async ({ id, qty }, thunkAPI) => {
    try {
      return await cartService.addToCart(id, qty);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const cartRemoveItems = createAsyncThunk(
  "cartItems/CART_REMOVE_ITEM",
  async (id, thunkAPI) => {
    try {
      return id;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const saveShippingAddress = createAsyncThunk(
  "cartItems/SAVE_SHIPPING_ADDRESS",
  async (data, thunkAPI) => {
    try {
      return data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const cartSlice = createSlice({
  name: "productList",
  initialState,
  reducers: {
    reset: (state) => {
      state.isError = false;
      state.isLoading = false;
      state.isSuccess = false;
      state.message = "";
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
    },
    calItemPrice: (state) => {
      state.itemsPrice = state.cartItems.reduce(
        (acc, item) => acc + item.price * item.qty,
        0
      );
    },
    calShippingPrice: (state) => {
      state.shippingPrice = state.itemsPrice > 100 ? 0 : 100;
    },
    calTaxPrice: (state) => {
      state.taxPrice = Number((0.15 * state.itemsPrice).toFixed(2));
    },
    calTotalPrice: (state) => {
      state.totalPrice =
        Number(state.itemsPrice) +
        Number(state.shippingPrice) +
        Number(state.taxPrice);
    },
  },
  extraReducers: (builder) => {
    //Get Product List
    builder.addCase(cartAddItems.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(cartAddItems.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.message = "Fetched Successfully";
      const item = action.payload;
      const existItemIndex = state.cartItems.findIndex(
        (x) => x.product === item.product
      );

      if (existItemIndex !== -1) {
        // If item already exists, update its quantity
        // state.cartItems[existItemIndex].qty += item.qty;
        // If want to replace with New order only
        state.cartItems[existItemIndex] = item;
      } else {
        // Otherwise, add the new item to the cart
        state.cartItems.push(item);
      }
      //need to save this item to local storage also
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    });
    builder.addCase(cartAddItems.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload;
    });

    //Remove Cart
    builder.addCase(cartRemoveItems.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(cartRemoveItems.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.message = "Product Details Fetched Successfully";
      state.cartItems = state.cartItems.filter(
        (x) => x.product !== action.payload
      );
      //need to remove this item from local storage also
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    });
    builder.addCase(cartRemoveItems.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload;
    });

    //Save Shipping Address
    builder.addCase(saveShippingAddress.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(saveShippingAddress.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.shippingAddress = action.payload;
      //need to remove this item from local storage also
      localStorage.setItem(
        "shippingAddress",
        JSON.stringify(state.shippingAddress)
      );
    });
    builder.addCase(saveShippingAddress.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload;
    });
  },
});

// Action creators are generated for each case reducer function
export const {
  reset,
  calItemPrice,
  calShippingPrice,
  calTaxPrice,
  calTotalPrice,
  savePaymentMethod,
} = cartSlice.actions;

export default cartSlice.reducer;

// const item = action.payload;
// const existItem = state.cartItems.find((x) => x.product === item.product);
// if (existItem) {
//   return {
//     ...state,
//     cartItems: state.cartItems.map((x) =>
//       x.product === existItem.product ? item : x
//     ),
//   };
// } else {
//   return {
//     ...state,
//     cartItems: [...state.cartItems, item],
//   };
// }
