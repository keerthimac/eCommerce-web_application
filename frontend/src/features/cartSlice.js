import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import productService from "./productService";

const initialState = {
  cart: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// export const cardAddItem = createAsyncThunk(
//   "cart/CART_ADD_ITEM",
//   async (_, thunkAPI) => {
//     try {
//       return await productService.listProducts();
//     } catch (error) {
//       const message =
//         (error.response &&
//           error.response.data &&
//           error.response.data.message) ||
//         error.message ||
//         error.toString();
//       return thunkAPI.rejectWithValue(message);
//     }
//   }
// );

// export const getProductDetails = createAsyncThunk(
//   "product/PRODUCT_DETAILS",
//   async (productId, thunkAPI) => {
//     try {
//       return await productService.getProduct(productId);
//     } catch (error) {
//       const message =
//         (error.response &&
//           error.response.data &&
//           error.response.data.message) ||
//         error.message ||
//         error.toString();
//       return thunkAPI.rejectWithValue(message);
//     }
//   }
// );

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
    cartAddItem: (state, action) => {
        const item = action.payload;
        const existItem = state.cart.find((x) => x.product === item.product);
        if (existItem) {
            state.cart = state.cart.map((x) =>
            x.product === existItem.product ? item : x
            );
        } else {
            state.cart = [...state.cart, item];
        }
        },
        cartRemoveItem: (state, action) => {
        state.cart = state.cart.filter((x) => x.product !== action.payload);
          },
  },
//   extraReducers: (builder) => {
//     //Get Product List
//     builder.addCase(getProductDetails.pending, (state) => {
//       state.isLoading = true;
//     });
//     builder.addCase(getProductDetails.fulfilled, (state, action) => {
//       state.isLoading = false;
//       state.isSuccess = true;
//       state.message = "Product List Fetched Successfully";
//       state.product = action.payload;
//     });
//     builder.addCase(getProductDetails.rejected, (state, action) => {
//       state.isLoading = false;
//       state.isError = true;
//       state.message = action.payload;
//     });

//     //Get Product List
//     builder.addCase(getProductList.pending, (state) => {
//       state.isLoading = true;
//     });
//     builder.addCase(getProductList.fulfilled, (state, action) => {
//       state.isLoading = false;
//       state.isSuccess = true;
//       state.message = "Product Details Fetched Successfully";
//       state.products = action.payload;
//     });
//     builder.addCase(getProductList.rejected, (state, action) => {
//       state.isLoading = false;
//       state.isError = true;
//       state.message = action.payload;
//     });
//   },
});

// Action creators are generated for each case reducer function
export const { reset,cartAddItem } = cartSlice.actions;

export default cartSlice.reducer;
