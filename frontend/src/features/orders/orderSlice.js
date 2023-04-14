import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import orderService from "./orderService";

//Get user from local storage
const user = JSON.parse(localStorage.getItem("user"));

const initialState = {
  order: null,
  sessionUrl: null,
  checkoutDetails: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
}; // State

//Create Order
export const createOrder = createAsyncThunk(
  "order/CreateOrder",
  async (order, thunkAPI) => {
    try {
      return await orderService.orderCreate(order);
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
//Get Order
export const getOrderDetails = createAsyncThunk(
  "order/GetOrder",
  async (orderId, thunkAPI) => {
    try {
      return await orderService.orderGet(orderId);
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

//create session
export const stripeSession = createAsyncThunk(
  "order/StripeSession",
  async ({ orderId, orderBody }, thunkAPI) => {
    try {
      return await orderService.sessionStripe({ orderId, orderBody });
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

//get checkout details
export const getCheckoutDetails = createAsyncThunk(
  "order/StripeCheckoutDetails",
  async ({ orderId, checkoutId }, thunkAPI) => {
    try {
      return await orderService.checkoutDetailsGet({ orderId, checkoutId });
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

//pay order
export const payOrder = createAsyncThunk(
  "order/OrderPay",
  async ({ orderId, paymentResult }, thunkAPI) => {
    try {
      return await orderService.orderPay({ orderId, paymentResult });
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

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    reset: (state) => {
      // state.order = {};
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    //extraReducers use for bind action between tasks such as pending,fulfilled,rejected'
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.order = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.order = null;
      })
      .addCase(getOrderDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.order = action.payload;
      })
      .addCase(getOrderDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.order = null;
      })
      .addCase(payOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(payOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.order = action.payload;
      })
      .addCase(payOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.order = null;
      })
      .addCase(stripeSession.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(stripeSession.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.sessionUrl = action.payload;
      })
      .addCase(stripeSession.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.sessionUrl = null;
      })
      .addCase(getCheckoutDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCheckoutDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.checkoutDetails = action.payload;
      })
      .addCase(getCheckoutDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.checkoutDetails = null;
      });
  },
});

export const { reset } = orderSlice.actions;
export default orderSlice.reducer;
