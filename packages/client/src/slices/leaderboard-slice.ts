import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store/store';
import type { ILeaderboard } from '../types';
import { ERequestMethods } from '../enums';
import { thunkCreator } from './thunk-creator';

interface LeaderboardState {
  data: ILeaderboard[];
  isLoading: boolean;
  error: {
    status: string | null;
    message: string | null;
    data: unknown;
  };
}

const initialState: LeaderboardState = {
  data: [],
  isLoading: false,
  error: {
    status: null,
    message: null,
    data: null,
  },
};

export const fetchLeaderboardThunk = thunkCreator<ILeaderboard[]>(
  'user/fetchLeaderboardThunk',
  async _ => {
    return fetch('url', {
      method: ERequestMethods.GET,
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include' as RequestCredentials,
    });
  }
);

const MOCK: ILeaderboard[] = [
  {
    id: '1',
    name: 'Test 1',
    games: '10',
    wins: '2',
  },
  {
    id: '2',
    name: 'Test 2',
    games: '5',
    wins: '1',
  },
  {
    id: '3',
    name: 'Test 3',
    games: '24',
    wins: '7',
  },
  {
    id: '4',
    name: 'Test 4',
    games: '1',
    wins: '0',
  },
  {
    id: '5',
    name: 'Test 5',
    games: '12',
    wins: '7',
  },
  {
    id: '6',
    name: 'Test 6',
    games: '4',
    wins: '2',
  },
  {
    id: '7',
    name: 'Test 7',
    games: '9',
    wins: '3',
  },
  {
    id: '8',
    name: 'Test 8',
    games: '5',
    wins: '4',
  },
];

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
      // Handle leaderboard data
      .addCase(fetchLeaderboardThunk.pending, state => {
        state.data = [];
        state.isLoading = true;
      })
      .addCase(fetchLeaderboardThunk.fulfilled, state => {
        state.data = MOCK;
        state.isLoading = false;
      })
      .addCase(fetchLeaderboardThunk.rejected, state => {
        state.data = [];
        state.isLoading = false;
      });
  },
});

export const { setLeaderboard } = leaderboardSlice.actions;
export const selectLeaderboard = (state: RootState) => state.leaderboard;

export default leaderboardSlice.reducer;
