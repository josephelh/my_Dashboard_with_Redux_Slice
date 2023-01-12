import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


const initialState = {
  product: null,
  loading: false,
  error: null,
  successCreate: false,
  successDelete: false,
  successUpdate: false,
  createdProductId: null,
};

const baseurl = 'http://localhost:5001';

export const createProduct = createAsyncThunk(
  'product/createProduct',
  async () => {
    const response = await axios.post(`${baseurl}/products`);
    return response.data;
  }
);

export const deleteProduct = createAsyncThunk(
  'product/deleteProduct',
  async id => {
    await axios.delete(`${baseurl}/products/${id}`);
  }
);

export const updateProduct = createAsyncThunk(
  'product/updateProduct',
  async product => {
    const response = await axios.put(`${baseurl}/products/${product._id}`, product);
    return response.data;
  }
);

export const fetchProductDetails = createAsyncThunk(
  'product/fetchProductDetails',
  async id => {
    const response = await axios.get(`${baseurl}/products/${id}`);
    return response.data;
  }
);

const productCreateSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    resetProduct: (state) => {     
      state.successCreate = false;
      state.successDelete = false;
      state.createdProductId = null;
      state.product= null;      
    },
    resetSuccessCreate: (state) => {     
      state.successCreate = false;         
    },
    resetSuccessDelete: (state) => {     
      state.successDelete = false;         
    },
    resetSuccessUpdate: (state) => {     
      state.successUpdate = false;         
    },
  },
  extraReducers: (build) => {
    build.addCase(createProduct.pending, (state) => {
      state.loading = true;
      state.successCreate = false;
    });
    build.addCase(createProduct.fulfilled, (state, action) => {
      state.loading = false;
      state.product = action.payload;
      state.successCreate = true;
      state.createdProductId = action.payload._id;
    });
    build.addCase(createProduct.rejected, (state, action) => {
      state.loading = false;
      state.successCreate = false;
      state.error = action.error.message;
    });
    build.addCase(deleteProduct.pending, (state) => {
      state.loading = true;
    });
    build.addCase(deleteProduct.fulfilled, (state, action) => {
      state.loading = false;
      state.successDelete = true;
    });
    build.addCase(deleteProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    build.addCase(updateProduct.pending, (state) => {
      state.loading = true;
    });
    build.addCase(updateProduct.fulfilled, (state, action) => {
      state.loading = false;
      state.successUpdate = true;
      state.product = action.payload;
    });
    build.addCase(updateProduct.rejected, (state, action) =>{
      state.loading= false;
      state.error = action.error.message;
    });
    build.addCase(fetchProductDetails.pending, (state) => {
      state.loading = true;
    });
    build.addCase(fetchProductDetails.fulfilled, (state, action) => {
      state.loading = false;
      state.product = action.payload;
    });
    build.addCase(fetchProductDetails.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  }
})

export const {
  createProductStart,
  createProductSuccess,
  createProductError,
  deleteProductStart,
  deleteProductSuccess,
  deleteProductError,
  updateProductStart,
  updateProductSuccess,
  updateProductError,
  fetchProductDetailsStart,
  fetchProductDetailsSuccess,
  fetchProductDetailsError,
  resetProduct,
  resetSuccessCreate,
  resetSuccessDelete,
  resetSuccessUpdate,
  
} = productCreateSlice.actions;

export default productCreateSlice.reducer;