import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  orders: [],
  order: null,
  loading: false,
  error: null,
  monthlyOrderTotal: 0,
  productOrderCountByMonth: [],
};

const baseUrl = process.env.REACT_APP_API_BASE_URL;

// export const fetchOrders = createAsyncThunk(
//   "orders/fetchOrders",
//   async (_, thunkAPI) => {
//     const { userLogin } = thunkAPI.getState().users;
//     const { token } = userLogin;

//     const config = {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     };
//     const response = await axios.get(`${baseUrl}/orders`, config);
//     return response.data;
//   }
// );
export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (params, thunkAPI) => {
    const { userLogin } = thunkAPI.getState().users;
    const { token } = userLogin;

    const { page, pageSize, sort, keyword } = params;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        page,
        pageSize,
        sort,
        keyword
      }
    };
    const response = await axios.get(`${baseUrl}/orders`, config);
    return response.data;
  }
);


export const fetchOrder = createAsyncThunk(
  "orders/fetchOrder",
  async (id, thunkAPI) => {
    const { userLogin } = thunkAPI.getState().users;
    const { token } = userLogin;

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.get(`${baseUrl}/orders/${id}`, config);
    return response.data;
  }
);

export const clientOrders = createAsyncThunk(
  "orders/clientrders",
  async (id, thunkAPI) => {
    const { userLogin } = thunkAPI.getState().users;
    const { token } = userLogin;

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.get(`${baseUrl}/orders/client/${id}`, config);
    return response.data;
  }
);

export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (order, thunkAPI) => {
    const { userLogin } = thunkAPI.getState().users;
    const { token } = userLogin;

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.post(`${baseUrl}/orders`, order, config);
    return response.data;
  }
);

export const updateOrder = createAsyncThunk(
  "orders/updateOrder",
  async (order, thunkAPI) => {
    const { userLogin } = thunkAPI.getState().users;
    const { token } = userLogin;

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.patch(
      `${baseUrl}/orders/${order._id}`,
      order,
      config
    );
    return response.data;
  }
);

export const deleteOrder = createAsyncThunk(
  "orders/deleteOrder",
  async (id, thunkAPI) => {
    const { userLogin } = thunkAPI.getState().users;
    const { token } = userLogin;

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    await axios.delete(`${baseUrl}/orders/${id}`, config);
  }
);

export const getMonthlyOrderTotal = createAsyncThunk(
  "orders/getMonthlyOrderTotal",
  async (id, thunkAPI) => {
    const { userLogin } = thunkAPI.getState().users;
    const { token } = userLogin;

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.get(`${baseUrl}/orders/orderstotal/${id}`, config);
    return response.data;
  }
);

export const getProductOrderCountByMonth = createAsyncThunk(
  "orders/getProductOrderCountByMonth",
  async ({year , month}, thunkAPI) => {
    
    const { userLogin } = thunkAPI.getState().users;
    const { token } = userLogin;

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.get(
      `${baseUrl}/orders/products/${year}?month=${month}`,
      config
    );
    return response.data;
  }
  
);

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    resetOrder: (state) => {
      state.order = null;
    },
  },
  extraReducers: (build) => {
    build
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(fetchOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.push(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.loading = false;
        const updatedOrder = action.payload;
        state.orders = state.orders.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        );
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = state.orders.filter(
          (order) => order._id !== action.meta.arg
        );
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
    build.addCase(getMonthlyOrderTotal.pending, (state) => {
      state.loading = true;
    });
    build.addCase(getMonthlyOrderTotal.fulfilled, (state, action) => {
      state.loading = false;
      state.monthlyOrderTotal = action.payload;
    });
    build.addCase(getMonthlyOrderTotal.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    build.addCase(getProductOrderCountByMonth.pending, (state) => {
      state.loading = true;
    });
    build.addCase(getProductOrderCountByMonth.fulfilled, (state, action) => {
      state.loading = false;
      state.productOrderCountByMonth = action.payload;
    });
    build.addCase(getProductOrderCountByMonth.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export const {
  resetOrder,
  fetchOrdersStart,
  fetchOrdersSuccess,
  fetchOrdersError,
  fetchOrderStart,
  fetchOrderSuccess,
  fetchOrderError,
  createOrderStart,
  createOrderSuccess,
  createOrderError,
  updateOrderStart,
  updateOrderSuccess,
  updateOrderError,
  deleteOrderStart,
  deleteOrderSuccess,
  deleteOrderError,
  getMonthlyOrderTotalStart,
  getMonthlyOrderTotalSuccess,
  getMonthlyOrderTotalError,
  getProductOrderCountByMonthStart,
  getProductOrderCountByMonthSuccess,
  getProductOrderCountByMonthError,
} = orderSlice.actions;

export default orderSlice.reducer;
