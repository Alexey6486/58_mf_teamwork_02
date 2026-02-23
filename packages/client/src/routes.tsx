import type { AppDispatch, RootState } from './store';
import { useParams } from 'react-router-dom';
import {
  AuthorizationPage,
  PasswordChange,
  ProfilePage,
  RegistrationPage,
  initNotFoundPage,
  NotFoundPage,
  Error500,
} from './pages';

export type PageInitContext = {
  clientToken?: string;
};

export type PageInitArgs = {
  dispatch: AppDispatch;
  state: RootState;
  ctx: PageInitContext;
};

export const ROUTES = {
  main: '/main',
  profile: '/profile',
  password: '/profile/password',
  login: '/',
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
    Component: AuthorizationPage,
    fetchData: () => null,
  },
  {
    path: ROUTES.signup,
    Component: RegistrationPage,
    fetchData: () => null,
  },
  {
    path: ROUTES.main,
    Component: () => <div>Main</div>,
    fetchData: () => null,
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
  {
    path: '*',
    Component: NotFoundPage,
    fetchData: initNotFoundPage,
  },
];
