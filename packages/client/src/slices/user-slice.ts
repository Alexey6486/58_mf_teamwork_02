import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import type { IUser, IUserPassword } from '../types';
import {
  URL_AVATAR,
  URL_BASE,
  URL_PROFILE,
  URL_PSW,
  URL_USER_DATA,
} from '../constants/urls';
import { ERequestMethods } from '../enums';
import { thunkCreator } from './thunk-creator';

// TODO разобораться с этими переменными
// import { SERVER_HOST } from '../constants'

interface UserState {
  data: Partial<IUser> | null;
  isLoading: boolean;
  error: {
    status: string | null;
    message: string | null;
    data: unknown;
  };
}

const initialState: UserState = {
  data: null,
  isLoading: false,
  error: {
    status: null,
    message: null,
    data: null,
  },
};

export const fetchUserThunk = thunkCreator<Partial<IUser>>(
  'user/fetchUserDataThunk',
  async _ => {
    return fetch(`${URL_BASE}${URL_USER_DATA}`, {
      method: ERequestMethods.GET,
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include' as RequestCredentials,
    });
  }
);

export const changeUserDataThunk = thunkCreator<Partial<IUser>, Partial<IUser>>(
  'user/changeUserDataThunk',
  async userData => {
    return fetch(`${URL_BASE}${URL_PROFILE}`, {
      method: ERequestMethods.PUT,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
      credentials: 'include' as RequestCredentials,
    });
  }
);

export const changeUserAvatar = thunkCreator<Partial<IUser>, FormData>(
  'user/changeUserAvatar',
  async avatar => {
    return fetch(`${URL_BASE}${URL_AVATAR}`, {
      method: ERequestMethods.PUT,
      body: avatar,
      credentials: 'include' as RequestCredentials,
    });
  }
);

export const changeUserPasswordThunk = thunkCreator<
  string,
  Partial<IUserPassword>
>('user/changeUserPasswordThunk', async userPassword => {
  return fetch(`${URL_BASE}${URL_PSW}`, {
    method: ERequestMethods.PUT,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userPassword),
    credentials: 'include' as RequestCredentials,
  });
});

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // Handle fetch user data
      .addCase(fetchUserThunk.pending, state => {
        state.data = null;
        state.isLoading = true;
      })
      .addCase(
        fetchUserThunk.fulfilled,
        (state, { payload }: PayloadAction<Partial<IUser>>) => {
          state.data = payload;
          state.isLoading = false;
        }
      )
      .addCase(fetchUserThunk.rejected, state => {
        state.isLoading = false;
      })

      // Handle user data change
      .addCase(changeUserDataThunk.pending, state => {
        state.isLoading = true;
      })
      .addCase(
        changeUserDataThunk.fulfilled,
        (state, { payload }: PayloadAction<Partial<IUser>>) => {
          state.data = payload;
          state.isLoading = false;
        }
      )
      .addCase(changeUserDataThunk.rejected, state => {
        state.isLoading = false;
      })

      // Handle user avatar change
      .addCase(changeUserAvatar.pending.type, state => {
        state.isLoading = true;
      })
      .addCase(
        changeUserAvatar.fulfilled.type,
        (state, { payload }: PayloadAction<Partial<IUser>>) => {
          state.data = payload;
          state.isLoading = false;
        }
      )
      .addCase(changeUserAvatar.rejected.type, state => {
        state.isLoading = false;
      })

      // Handle user password change
      .addCase(changeUserPasswordThunk.pending.type, state => {
        state.isLoading = true;
      })
      .addCase(changeUserPasswordThunk.fulfilled.type, state => {
        state.isLoading = false;
      })
      .addCase(changeUserPasswordThunk.rejected.type, state => {
        state.isLoading = false;
      });
  },
});

export const selectUser = (state: RootState) => state.user.data;

export default userSlice.reducer;
