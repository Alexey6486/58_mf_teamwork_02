import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import type { IUser, IUserPassword } from '../types'
import {
  URL_AVATAR,
  URL_BASE,
  URL_PROFILE,
  URL_PSW,
  URL_USER_DATA
} from '../constants/urls'

// TODO разобораться с этими переменными
// import { SERVER_HOST } from '../constants'

export interface UserState {
  data: IUser | null
  isLoading: boolean
  error: {
    status: string | null
    message: string | null
    data: unknown
    isNetworkError: boolean
  },
}

const initialState: UserState = {
  data: null,
  isLoading: false,
  error: {
    status: null,
    message: null,
    data: null,
    isNetworkError: false,
  },
}

// Chain sample:
// Thunk A: Fetch user
// export const fetchUser = createAsyncThunk(
//   'user/fetchUser',
//   async (userId) => {
//     const response = await fetch(`/api/users/${userId}`);
//     return await response.json();
//   }
// );
// Thunk B: Fetch user posts (needs user ID)
// export const fetchUserPosts = createAsyncThunk(
//   'posts/fetchUserPosts',
//   async (userId, thunkAPI) => {
//     // Optionally wait for fetchUser to finish
//     try {
//       await thunkAPI.dispatch(fetchUser(userId)).unwrap();
//       const response = await fetch(`/api/posts?userId=${userId}`);
//       return await response.json();
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.message);
//     }
//   }
// );

export const fetchUserThunk = createAsyncThunk(
  'user/fetchUserDataThunk',
  async (_: void, { rejectWithValue }) => {
    try {
      const url = `${URL_BASE}${URL_USER_DATA}`
      const response = await fetch(
        url,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        }
      );

      if (!response.ok) {
        let errorData = null;
        try {
          errorData = await response.json();
        } catch (e: unknown) {
          errorData = { message: response.statusText };
        }

        return rejectWithValue({
          status: response.status,
          data: errorData,
          message: errorData?.message || `HTTP error: ${response.status} ${response.statusText}`,
        });
      }

      return await response.json();
    }
    catch (error: unknown) {
      let errorMessage = 'Network error.';

      if (error instanceof Error) {
        errorMessage = error.message;

        return rejectWithValue({
          status: null,
          message: errorMessage,
          data: null,
        });
      }

      return rejectWithValue({
        status: null,
        message: errorMessage,
      });
    }
  }
);

export const changeUserDataThunk = createAsyncThunk(
  'user/changeUserDataThunk',
  async (userData: Partial<IUser>) => {
    const url = `${URL_BASE}${URL_PROFILE}`
    return fetch(
      url,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
        credentials: 'include',
      }
    ).then(res => res.json())
  }
);

export const changeUserAvatar = createAsyncThunk(
  'user/changeUserAvatar',
  async (avatar: FormData) => {
    const url = `${URL_BASE}${URL_AVATAR}`
    return fetch(
      url,
      {
        method: 'PUT',
        body: avatar,
        credentials: 'include',
      }
    ).then(res => res.json())
  }
);

export const changeUserPasswordThunk = createAsyncThunk(
  'user/changeUserPasswordThunk',
  async (userData: Partial<IUserPassword>) => {
    const url = `${URL_BASE}${URL_PSW}`
    return fetch(
      url,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
        credentials: 'include',
      }
    ).then(res => {
      return res.json();
    })
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // Handle fetch user data
      .addCase(fetchUserThunk.pending, state => {
        state.data = null
        state.isLoading = true
      })
      .addCase(
        fetchUserThunk.fulfilled,
        (state, { payload }: PayloadAction<IUser>) => {
          state.data = payload
          state.isLoading = false
        }
      )
      .addCase(fetchUserThunk.rejected, state => {
        state.isLoading = false
      })

      // Handle user data change
      .addCase(changeUserDataThunk.pending.type, (state) => {
        state.isLoading = true
      })
      .addCase(changeUserDataThunk.fulfilled.type, (state, { payload }: PayloadAction<IUser>) => {
        state.data = payload;
        state.isLoading = false
      })
      .addCase(changeUserDataThunk.rejected.type, (state) => {
        state.isLoading = false
      })

    // Handle user avatar change
    .addCase(changeUserAvatar.pending.type, (state) => {
        state.isLoading = true
      })
    .addCase(changeUserAvatar.fulfilled.type, (state, { payload }: PayloadAction<IUser>) => {
      state.data = payload;
      state.isLoading = false
    })
    .addCase(changeUserAvatar.rejected.type, (state) => {
      state.isLoading = false
    })

    // Handle user password change
    .addCase(changeUserPasswordThunk.pending.type, (state) => {
        state.isLoading = true
      })
    .addCase(changeUserPasswordThunk.fulfilled.type, (state) => {
      state.isLoading = false
    })
    .addCase(changeUserPasswordThunk.rejected.type, (state) => {
      state.isLoading = false
    });
  },
})

export const selectUser = (state: RootState) => state.user.data

export default userSlice.reducer
