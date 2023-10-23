import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  formData,
  getUsers,
  getUsersResponse,
  login,
  logout,
  refresh,
  register,
} from '../API';

interface InitialState {
  isAuth: boolean;
  email: string | null;
  users: getUsersResponse[] | null;
}

const initialState: InitialState = {
  isAuth: false,
  email: null,
  users: null,
};

export const handleRegister = createAsyncThunk('register', register);
export const handleLogin = createAsyncThunk('login', login);
export const handleLogout = createAsyncThunk('logout', logout);
export const checkAuth = createAsyncThunk('refresh', refresh);
export const handleGetUsers = createAsyncThunk('getUsers', getUsers);

const mainSlice = createSlice({
  initialState: initialState,
  name: 'main',
  reducers: {
    setUserEmail: (state, action: PayloadAction<{ email: string | null }>) => {
      state.email = action.payload.email;
      //   state.user.password = action.payload.password;
    },
  },
  extraReducers: (builder) => {
    builder
      //   .addCase(handleRegister.pending, (state, action) => {
      //     state.isAuth = false;
      //   })
      //   .addCase(handleLogin.pending, (state, action) => {
      //     state.isAuth = false;
      //   })
      .addCase(handleLogin.fulfilled, (state, action) => {
        if (!action.payload?.accessToken) {
          return;
        }
        state.isAuth = true;
        localStorage.setItem('accessToken', action.payload?.accessToken);
      })
      .addCase(handleLogout.fulfilled, (state, action) => {
        if (!action.payload?.refreshToken) {
          return;
        }
        localStorage.removeItem('accessToken');
        state.isAuth = false;
      })
      .addCase(handleRegister.fulfilled, (state, action) => {
        if (!action.payload?.accessToken) {
          return;
        }
        state.isAuth = true;
        localStorage.setItem('accessToken', action.payload?.accessToken);
      })
      //   .addCase(checkAuth.pending, (state, action) => {
      //     state.isAuth = false;
      //   })
      .addCase(checkAuth.fulfilled, (state, action) => {
        if (!action.payload?.accessToken) {
          return;
        }
        state.isAuth = true;
        localStorage.setItem('accessToken', action.payload.accessToken);
      })
      .addCase(handleGetUsers.fulfilled, (state, action) => {
        const users = action.payload;
        if (!users) {
          return;
        }
        state.users = users;
      });
  },
});

export const mainReducer = mainSlice.reducer;
export const { setUserEmail } = mainSlice.actions;
