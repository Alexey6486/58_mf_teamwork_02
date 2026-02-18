import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import type { IUser } from '../types'
import {
  URL_BASE,
  URL_PROFILE,
  URL_USER_DATA
} from '../constants/urls'

// TODO разобораться с этими переменными
// import { SERVER_HOST } from '../constants'

export interface UserState {
  data: IUser | null
  isLoading: boolean
}

const initialState: UserState = {
  data: null,
  isLoading: false,
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
  async (_: void) => {
    const url = `${URL_BASE}${URL_USER_DATA}`
    return fetch(
      url,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }
    ).then(res => res.json())
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
)

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchUserThunk.pending.type, state => {
        state.data = null
        state.isLoading = true
      })
      .addCase(
        fetchUserThunk.fulfilled.type,
        (state, { payload }: PayloadAction<IUser>) => {
          state.data = payload
          state.isLoading = false
        }
      )
      .addCase(fetchUserThunk.rejected.type, state => {
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
      });
  },
})

export const selectUser = (state: RootState) => state.user.data

export default userSlice.reducer
