import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store/store';
import type {
  IUser,
  IUserPassword,
  IServerUser,
  IServerUserThemeResponse,
} from '../types';
import {
  SERVER_URI,
  URL_AVATAR,
  URL_BASE,
  URL_PROFILE,
  URL_PSW,
  URL_THEME,
  URL_USER_DATA,
} from '../constants/urls';
import { ERequestMethods, type ETheme } from '../enums';
import { thunkCreator } from './thunk-creator';

export interface UserState {
  data: Partial<IUser> | null;
  score: number;
  theme: ETheme | null;
  isLoading: boolean;
  error: {
    status: string | null;
    message: string | null;
    data: unknown;
  };
}

const initialState: UserState = {
  data: null,
  score: 0,
  theme: null,
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
    console.log('fetchUserThunk', { URL_BASE });
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

export const changeUserAvatarThunk = thunkCreator<Partial<IUser>, FormData>(
  'user/changeUserAvatarThunk',
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

export const fetchUserTheme = thunkCreator<
  IServerUserThemeResponse,
  Partial<IServerUser>
>('user/fetchUserTheme', async userData => {
  return fetch(`${SERVER_URI}${URL_THEME}`, {
    method: ERequestMethods.POST,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
    credentials: 'include' as RequestCredentials,
  });
});

export const changeUserTheme = thunkCreator<
  IServerUserThemeResponse,
  Partial<IServerUser>
>('user/changeUserTheme', async userData => {
  return fetch(`${SERVER_URI}${URL_THEME}`, {
    method: ERequestMethods.PUT,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
    credentials: 'include' as RequestCredentials,
  });
});

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUsers: (state, { payload }: PayloadAction<Partial<IUser>>) => {
      state.data = payload;
    },
    setUserRating: (state, action: PayloadAction<number | null>) => {
      state.score = action.payload ?? 0;
    },
    setUserTheme: (state, { payload }: PayloadAction<ETheme>) => {
      state.theme = payload;
    },
  },
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
      .addCase(changeUserAvatarThunk.pending.type, state => {
        state.isLoading = true;
      })
      .addCase(
        changeUserAvatarThunk.fulfilled.type,
        (state, { payload }: PayloadAction<Partial<IUser>>) => {
          state.data = payload;
          state.isLoading = false;
        }
      )
      .addCase(changeUserAvatarThunk.rejected.type, state => {
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
      })

      // Handle fetch user theme
      .addCase(fetchUserTheme.pending, state => {
        state.isLoading = true;
      })
      .addCase(
        fetchUserTheme.fulfilled,
        (state, { payload }: PayloadAction<IServerUserThemeResponse>) => {
          state.theme = payload.data.theme;
          state.isLoading = false;
        }
      )
      .addCase(fetchUserTheme.rejected, state => {
        state.isLoading = false;
      })

      // Handle change user theme
      .addCase(changeUserTheme.pending, state => {
        state.isLoading = true;
      })
      .addCase(
        changeUserTheme.fulfilled,
        (state, { payload }: PayloadAction<IServerUserThemeResponse>) => {
          state.theme = payload.data.theme;
          state.isLoading = false;
        }
      )
      .addCase(changeUserTheme.rejected, state => {
        state.isLoading = false;
      });
  },
});

export const { setUsers, setUserRating, setUserTheme } = userSlice.actions;
export const selectUser = (state: RootState) => state.user.data;
export const selectUserTheme = (state: RootState) => state.user.theme;
export const selectUserRating = (state: RootState) => state.user.score;

export default userSlice.reducer;
