import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  clients: [], 
  client: null,
  loading: false,
  error: null,
  successDelete : false,
};

const baseUrl = process.env.REACT_APP_API_BASE_URL;

export const addClient = createAsyncThunk("clients/addClient", async (client, thunkAPI) => {
    const { userLogin } = thunkAPI.getState().users;
    const { token } = userLogin;

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  const response = await axios.post(`${baseUrl}/clients`, client, config);
  return response.data;
});

export const deleteClient = createAsyncThunk("clients/deleteclient", async (id,thunkAPI) => {
    const { userLogin } = thunkAPI.getState().users;
    const { token } = userLogin;

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  await axios.delete(`${baseUrl}/clients/${id}`,config);
});

export const fetchClients = createAsyncThunk(
  "clients/fetchClients",
  async (keyword ="", thunkAPI) => {
    const { userLogin } = thunkAPI.getState().users;
    const { token } = userLogin;

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.get(`${baseUrl}/clients?keyword=${keyword}`, config);
    return response.data;
  }
);

export const fetchClientDetails = createAsyncThunk(
  "users/fetchClientDetails",
  async (id, thunkAPI) => {
    const { userLogin } = thunkAPI.getState().users;
    const { token } = userLogin;

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.get(`${baseUrl}/clients/${id}`, config);
    return response.data;
  }
);

export const updateClient = createAsyncThunk("clients/updateClient", async (client, thunkAPI) => {
    const { userLogin } = thunkAPI.getState().users;
    const { token } = userLogin;
  
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.put(`${baseUrl}/clients/${client._id}`, client, config);
    return response.data;
  });
  

const clientSlice = createSlice({
  name: "clients",
  initialState,
  reducers: {
    resetClient: (state) => {     
        state.client = null;      
      },
      resetSuccessDelete: (state) => {     
        state.successDelete = false;         
      },
  },
  extraReducers: (build) => {
    build.addCase(addClient.pending, (state) => {
      state.loading = true;
    });
    build.addCase(addClient.fulfilled, (state, action) => {
      state.loading = false;
      state.clients = [...state.clients, action.payload];
    });
    build.addCase(addClient.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    build.addCase(deleteClient.pending, (state) => {
      state.loading = true;
    });
    build.addCase(deleteClient.fulfilled, (state, action) => {
      state.loading = false;
      state.successDelete = true;
      state.clients = state.clients.filter((client) => client._id !== action.payload);
    });
    build.addCase(deleteClient.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    build.addCase(fetchClients.pending, (state) => {
      state.loading = true;
    });
    build.addCase(fetchClients.fulfilled, (state, action) => {
      state.loading = false;
      state.clients = action.payload;
    });
    build.addCase(fetchClients.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    build.addCase(fetchClientDetails.pending, (state) => {
      state.loading = true;
    });
    build.addCase(fetchClientDetails.fulfilled, (state, action) => {
      state.loading = false;
      state.client = action.payload;
    });
    build.addCase(fetchClientDetails.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    build.addCase(updateClient.pending, (state) => {
        state.loading = true;
      });
      build.addCase(updateClient.fulfilled, (state, action) => {
        state.loading = false;
        state.client = action.payload;
      });
      build.addCase(updateClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });    
  },
});

export const {
  addClientStart,
  addClientSuccess,
  addClientError,
  deleteClientStart,
  deleteClientSuccess,
  deleteClientError,
  fetchClientsStart,
  fetchClientSuccess,
  fetchClientsError,
  fetchClientDetailsStart,
  fetchClientDetailsSuccess,
  fetchClientDetailsError,
  updateClientStart,
  updateClientSuccess,
  updateClientError,
  resetClient,
  resetSuccessDelete,
} = clientSlice.actions;

export default clientSlice.reducer;
