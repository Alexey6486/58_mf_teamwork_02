import { createSlice } from '@reduxjs/toolkit';
import type { IAuthorizationForm, IUser } from '../types';
import { thunkCreator } from './thunk-creator';
import {
  URL_BASE,
  URL_LOGIN,
  URL_LOGOUT,
  URL_SIGNUP,
  URL_OAUTH_SERVICE_ID,
  URL_OAUTH_YANDEX,
  OAUTH_REDIRECT_URI,
  SERVER_URI,
} from '../constants/urls';
import { ERequestMethods } from '../enums';
import { type RootState } from '../store/store';
import { type IRegistrationDto } from '../types/user';

export interface AuthState {
  data: IUser | null;
  isLoading: boolean;
  error: {
    status: string | null;
    message: string | null;
    data: unknown;
  };
}

const initialState: AuthState = {
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
    return fetch(`${SERVER_URI}${URL_LOGIN}`, {
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

export const signupThunk = thunkCreator<string, Partial<IRegistrationDto>>(
  'auth/signupThunk',
  async regForm => {
    return fetch(`${URL_BASE}${URL_SIGNUP}`, {
      method: ERequestMethods.POST,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(regForm),
      credentials: 'include' as RequestCredentials,
    });
  }
);

export const oauthGetServiceIdThunk = thunkCreator<{ service_id: string }>(
  'auth/oauthGetServiceId',
  async _ => {
    return fetch(
      `${URL_BASE}${URL_OAUTH_SERVICE_ID}?redirect_uri=${OAUTH_REDIRECT_URI}`,
      {
        credentials: 'include' as RequestCredentials,
      }
    );
  }
);

export const oauthYandexThunk = thunkCreator<string, { code: string }>(
  'auth/oauthYandex',
  async ({ code }) => {
    return fetch(`${URL_BASE}${URL_OAUTH_YANDEX}`, {
      method: ERequestMethods.POST,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, redirect_uri: OAUTH_REDIRECT_URI }),
      credentials: 'include' as RequestCredentials,
    });
  }
);

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
      })

      // Handle signup
      .addCase(signupThunk.pending, state => {
        state.isLoading = true;
      })
      .addCase(signupThunk.fulfilled, state => {
        state.isLoading = false;
      })
      .addCase(signupThunk.rejected, state => {
        state.isLoading = false;
      });
  },
});

export const selectAuth = (state: RootState) => state.auth.data;

export default authSlice.reducer;
