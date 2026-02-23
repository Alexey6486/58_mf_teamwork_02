import { createSlice } from '@reduxjs/toolkit';
import type { IAuthorizationForm, IUser } from '../types';
import { thunkCreator } from './thunk-creator';
import { URL_BASE, URL_LOGIN, URL_LOGOUT } from '../constants/urls';
import { ERequestMethods } from '../enums';
import { type RootState } from '../store/store';

interface IAuthState {
  data: IUser | null;
  isLoading: boolean;
  error: {
    status: string | null;
    message: string | null;
    data: unknown;
  };
}

const initialState: IAuthState = {
  data: null,
  isLoading: false,
  error: {
    status: null,
    message: null,
    data: null,
  },
};

export const loginThunk = thunkCreator<string, IAuthorizationForm>(
  'auth/loginThunk',
  async authForm => {
    return fetch(`${URL_BASE}${URL_LOGIN}`, {
      method: ERequestMethods.POST,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(authForm),
      credentials: 'include' as RequestCredentials,
    });
  }
);

export const logoutThunk = thunkCreator<string>('auth/logoutThunk', async _ => {
  return fetch(`${URL_BASE}${URL_LOGOUT}`, {
    method: ERequestMethods.POST,
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include' as RequestCredentials,
  });
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // Handle auth
      .addCase(loginThunk.pending, state => {
        state.data = null;
        state.isLoading = true;
      })
      .addCase(loginThunk.fulfilled, state => {
        state.isLoading = false;
      })
      .addCase(loginThunk.rejected, state => {
        state.data = null;
        state.isLoading = false;
      })

      // Handle logout
      .addCase(logoutThunk.pending, state => {
        state.data = null;
        state.isLoading = true;
      })
      .addCase(logoutThunk.fulfilled, state => {
        state.data = null;
        state.isLoading = false;
      })
      .addCase(logoutThunk.rejected, state => {
        state.data = null;
        state.isLoading = false;
      });
  },
});

export const selectAuth = (state: RootState) => state.auth.data;

export default authSlice.reducer;
