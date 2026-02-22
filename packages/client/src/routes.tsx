import type { AppDispatch, RootState } from './store';

import { initMainPage, MainPage } from './pages/Main';
import { PasswordChange, ProfilePage } from './pages';
// import { initFriendsPage, FriendsPage } from './pages/FriendsPage';
import { useParams } from 'react-router-dom';
import { initNotFoundPage, NotFoundPage } from './pages/error/NotFound';
import { Error500 } from './pages/error/Error500'

export type PageInitContext = {
  clientToken?: string;
};

export type PageInitArgs = {
  dispatch: AppDispatch;
  state: RootState;
  ctx: PageInitContext;
};

export const ROUTES = {
  main: '/',
  profile: '/profile',
  password: '/profile/password',
  login: '/login',
  signup: '/sign-up',
  game: '/game',
  leaderboard: '/leaderboard',
  forum: '/forum',
  topic: '/forum/:topicId',
  error500: '/error',
};

export const routes = [
  {
    path: ROUTES.login,
    Component: () => <div>LoginPage</div>,
    fetchData: () => null,
  },
  {
    path: ROUTES.signup,
    Component: () => <div>Signup</div>,
    fetchData: () => null,
  },
  {
    path: ROUTES.main,
    Component: MainPage,
    fetchData: initMainPage,
  },
  {
    path: ROUTES.profile,
    Component: ProfilePage,
    fetchData: () => null,
  },
  {
    path: ROUTES.password,
    Component: PasswordChange,
    fetchData: () => null,
  },
  {
    path: ROUTES.game,
    Component: () => <div>GAME</div>,
    fetchData: () => null,
  },
  {
    path: ROUTES.leaderboard,
    Component: () => <div>Leader Board</div>,
    fetchData: () => null,
  },
  {
    path: ROUTES.forum,
    Component: () => <div>Forum</div>,
    fetchData: () => null,
  },
  {
    path: ROUTES.topic,
    Component: () => <div>Topic number {useParams().topicId}</div>,
    fetchData: () => null,
  },
  {
    path: ROUTES.error500,
    Component: Error500,
    fetchData: () => null,
  },
  // {
  //   path: '/friends',
  //   Component: requireAuth(FriendsPage),
  //   fetchData: initFriendsPage,
  // },
  {
    path: '*',
    Component: NotFoundPage,
    fetchData: initNotFoundPage,
  }
];
