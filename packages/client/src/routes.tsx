import type { AppDispatch, RootState } from './store/store';
import { Navigate, useLocation, useParams } from 'react-router-dom';
import {
  AuthorizationPage,
  PasswordChange,
  ProfilePage,
  RegistrationPage,
  initNotFoundPage,
  NotFoundPage,
  Error500,
  GamePage,
  MainPage
} from './pages';
import { useIsAuthed } from './hooks';
import { useEffect, useState } from 'react';

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

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const location = useLocation();
  const { isAuthed } = useIsAuthed();

  const [shouldNavigate, setShouldNavigate] = useState(false);

  useEffect(() => {
    setShouldNavigate(true);
  }, []);

  if (shouldNavigate) {
    if (!isAuthed) {
      return <Navigate to={ROUTES.login} replace state={{ from: location }} />;
    }

    return children;
  }

  return null;
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
    element: (
      <ProtectedRoute>
        <MainPage />
      </ProtectedRoute>
    ),
    fetchData: () => null,
  },
  {
    path: ROUTES.profile,
    element: (
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    ),
    fetchData: () => null,
  },
  {
    path: ROUTES.password,
    element: (
      <ProtectedRoute>
        <PasswordChange />
      </ProtectedRoute>
    ),
    fetchData: () => null,
  },
  {
    path: ROUTES.game,
    element: (
      <ProtectedRoute>
        <GamePage />
      </ProtectedRoute>
    ),
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
