import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


const initialState = {
  products: [],
  loading: false,
  error: null,
};


const baseurl = 'http://localhost:5001';

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async () => {
    const response = await axios.get(`${baseurl}/products`);
    return response.data;
  }
);

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {},
    extraReducers: build => {
      build.addCase(fetchProducts.pending, state => {
        state.loading = true;
      });
      build.addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      });
      build.addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
     
    }
  });

  export const {
    fetchProductsStart,
    fetchProductsSuccess,
    fetchProductsError,   
  } = productSlice.actions;
  
  export default productSlice.reducer