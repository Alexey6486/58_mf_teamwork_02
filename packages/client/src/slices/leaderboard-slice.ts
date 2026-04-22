import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store/store';
import type { ILeaderboard } from '../types';
import { ERequestMethods } from '../enums';
import { thunkCreator } from './thunk-creator';
import { RATING_FIELD, TEAM_NAME, LIMIT_RATING } from '../constants/leaderboard';
import { URL_BASE, URL_LEADERBOARD } from '../constants/urls';

export interface LeaderboardState {
  data: ILeaderboard[] | null;
  isLoading: boolean;
  error: {
    status: string | null;
    message: string | null;
    data: unknown;
  };
}

export interface UpdateRatingUser {
  data: ILeaderboard | null;
}

export interface FetchLeaderBoard {
  cursor: number;
};

const initialState: LeaderboardState = {
  data: null,
  isLoading: false,
  error: {
    status: null,
    message: null,
    data: null,
  },
};

export const updateLeaderboardScore = thunkCreator<ILeaderboard, UpdateRatingUser>(
  'leaderboard/updateLeaderboardScore',
  async(dataRequest) => {
    const { data } = dataRequest;

    return fetch(`${URL_BASE}${URL_LEADERBOARD}`, {
      method: ERequestMethods.POST,
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include' as RequestCredentials,
      body: JSON.stringify({
        data,
        ratingFieldName: RATING_FIELD,
        teamName: TEAM_NAME,
      }),
    });
  }
);

export const fetchLeaderboardThunk = thunkCreator<ILeaderboard[], FetchLeaderBoard>(
  'leaderboard/fetchLeaderboardThunk',
  async ({ cursor }) => {
    const url = `${URL_BASE}${URL_LEADERBOARD}/${TEAM_NAME}`;

    return fetch(url, {
      method: ERequestMethods.POST,
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include' as RequestCredentials,
      body: JSON.stringify({
        ratingFieldName: RATING_FIELD,
        cursor,
        limit: LIMIT_RATING,
      })
    });
  }
);

export const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState,
  reducers: {
    setLeaderboard: (state, { payload }: PayloadAction<ILeaderboard[]>) => {
      state.data = payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchLeaderboardThunk.pending, state => {
        state.data = null;
        state.isLoading = true;
      })
      .addCase(fetchLeaderboardThunk.fulfilled, (state, action: PayloadAction<ILeaderboard[]>) => {
        state.data = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchLeaderboardThunk.rejected, state => {
        state.data = null;
        state.isLoading = false;
      });
  },
});

export const { setLeaderboard } = leaderboardSlice.actions;
export const selectLeaderboard = (state: RootState) => state.leaderboard;

export default leaderboardSlice.reducer;
