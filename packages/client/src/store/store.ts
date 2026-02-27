import {
  useDispatch as useDispatchBase,
  useSelector as useSelectorBase,
  type TypedUseSelectorHook,
  useStore as useStoreBase,
} from 'react-redux';
import { combineReducers, type Store } from 'redux';
import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit';
import ssrReducer from '../slices/ssr-slice';
import userReducer, { fetchUserThunk } from '../slices/user-slice';
import authReducer from '../slices/auth-slice';
import leaderboardReducer from '../slices/leaderboard-slice';
import { LS_KEY } from '../constants/auth';
import { ROUTES } from '../routes';

// Глобально декларируем в window наш ключик
// и задаем ему тип такой же как у стейта в сторе
declare global {
  interface Window {
    APP_INITIAL_STATE: RootState;
  }
}

export const reducer = combineReducers({
  ssr: ssrReducer,
  user: userReducer,
  auth: authReducer,
  leaderboard: leaderboardReducer,
});

export const listenerMiddleware = createListenerMiddleware<RootState>();

export const store = configureStore({
  reducer,
  preloadedState:
    typeof window === 'undefined' ? undefined : window.APP_INITIAL_STATE,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware),
});

listenerMiddleware.startListening({
  predicate: action => {
    return action.type === 'auth/loginThunk/fulfilled';
  },
  effect: async (action, listenerApi) => {
    try {
      const userData = await listenerApi.dispatch(fetchUserThunk()).unwrap();
      localStorage.setItem(LS_KEY, JSON.stringify(userData));
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  },
});

listenerMiddleware.startListening({
  predicate: action => {
    return action.type === 'auth/logoutThunk/fulfilled';
  },
  effect: async () => {
    try {
      localStorage.removeItem(LS_KEY);
      window.location.replace(ROUTES.login);
    } catch (error) {
      console.error('Failed to remove user data:', error);
    }
  },
});

listenerMiddleware.startListening({
  predicate: action => {
    return action.type === 'auth/signupThunk/fulfilled';
  },
  effect: async (action, listenerApi) => {
    try {
      const userData = await listenerApi.dispatch(fetchUserThunk()).unwrap();
      localStorage.setItem(LS_KEY, JSON.stringify(userData));
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  },
});

export type RootState = ReturnType<typeof reducer>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = useDispatchBase;
export const useSelector: TypedUseSelectorHook<RootState> = useSelectorBase;

export const useStore = (): Store<RootState> => {
  return useStoreBase<RootState>();
};
