import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  users: [],
  userLogin: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null,
  user: null,
  loading: false,
  error: null,
};

const baseUrl = process.env.REACT_APP_API_BASE_URL;

export const addUser = createAsyncThunk("users/addUser", async (user, thunkAPI) => {
    const { userLogin } = thunkAPI.getState().users;
    const { token } = userLogin;

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  const response = await axios.post(`${baseUrl}/users`, user, config);
  return response.data;
});

export const deleteUser = createAsyncThunk("users/deleteUser", async (id,thunkAPI) => {
    const { userLogin } = thunkAPI.getState().users;
    const { token } = userLogin;

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  await axios.delete(`${baseUrl}/users/${id}`,config);
});

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, thunkAPI) => {
    const { userLogin } = thunkAPI.getState().users;
    const { token } = userLogin;

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.get(`${baseUrl}/users`, config);
    return response.data;
  }
);

export const fetchUserDetails = createAsyncThunk(
  "users/fetchUserDetails",
  async (id, thunkAPI) => {
    const { userLogin } = thunkAPI.getState().users;
    const { token } = userLogin;

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.get(`${baseUrl}/users/${id}`, config);
    return response.data;
  }
);

export const updateUser = createAsyncThunk("users/updateUser", async (user, thunkAPI) => {
    const { userLogin } = thunkAPI.getState().users;
    const { token } = userLogin;
  
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.put(`${baseUrl}/users/${user._id}`, user, config);
    return response.data;
  });
  


export const login = createAsyncThunk(
  "users/login",
  async (payload, { rejectWithValue }) => {
    const { email, password } = payload;

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const response = await axios.post(
        `${baseUrl}/users/login`,
        { email, password },
        config
      );
      const { data } = response;
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const logout = createAsyncThunk("users/logout", async () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
});

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    resetUser: (state) => {     
        state.user = null;      
      },
  },
  extraReducers: (build) => {
    build.addCase(addUser.pending, (state) => {
      state.loading = true;
    });
    build.addCase(addUser.fulfilled, (state, action) => {
      state.loading = false;
      state.users = [...state.users, action.payload];
    });
    build.addCase(addUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    build.addCase(deleteUser.pending, (state) => {
      state.loading = true;
    });
    build.addCase(deleteUser.fulfilled, (state, action) => {
      state.loading = false;
      state.users = state.users.filter((user) => user._id !== action.payload);
    });
    build.addCase(deleteUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    build.addCase(fetchUsers.pending, (state) => {
      state.loading = true;
    });
    build.addCase(fetchUsers.fulfilled, (state, action) => {
      state.loading = false;
      state.users = action.payload;
    });
    build.addCase(fetchUsers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    build.addCase(fetchUserDetails.pending, (state) => {
      state.loading = true;
    });
    build.addCase(fetchUserDetails.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    });
    build.addCase(fetchUserDetails.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    build.addCase(updateUser.pending, (state) => {
        state.loading = true;
      });
      build.addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      });
      build.addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
    build.addCase(login.pending, (state) => {
      state.loading = true;
    });
    build.addCase(login.fulfilled, (state, action) => {
      state.loading = false;
      state.userLogin = action.payload;
      localStorage.setItem("userInfo", JSON.stringify(state.userLogin));
    });
    build.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    build.addCase(logout.pending, (state) => {
      state.loading = true;
    });
    build.addCase(logout.fulfilled, (state) => {
      state.loading = false;
      state.userLogin = null;
    });
    build.addCase(logout.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export const {
  addUserStart,
  addUserSuccess,
  addUserError,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserError,
  fetchUsersStart,
  fetchUsersSuccess,
  fetchUsersError,
  fetchUserDetailsStart,
  fetchUserDetailsSuccess,
  fetchUserDetailsError,
  loginStart,
  loginSuccess,
  loginError,
  logoutStart,
  logoutSuccess,
  logoutError,
  udpateUserStart,
  udpateUserSuccess,
  udpateUserError,
  resetUser,  
} = userSlice.actions;

export default userSlice.reducer;
