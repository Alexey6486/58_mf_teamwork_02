import { useEffect, useState } from 'react';
import type { AppDispatch, RootState } from './store/store';
import { Navigate, useLocation } from 'react-router-dom';
import {
  AuthorizationPage,
  PasswordChange,
  ProfilePage,
  RegistrationPage,
  initNotFoundPage,
  NotFoundPage,
  Error500,
  GamePage,
  MainPage,
  LeaderboardPage,
  initGamePage,
  initLeaderBoardPage,
  initProfilePage,
  initMainPage,
  initErrorPage,
  initAuthPage,
  initPasswordChangePage,
  initRegistrationPage,
  ForumPage,
  initForumPage,
  TopicPage,
  initTopicPage,
} from './pages';
import { useIsAuthed } from './hooks';

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
  topic: '/forum/:id',
  error500: '/error',
};

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const location = useLocation();
  const { isAuthed, isLoading } = useIsAuthed();
  const [shouldNavigate, setShouldNavigate] = useState(false);

  useEffect(() => {
    setShouldNavigate(true);
  }, []);

  if (shouldNavigate) {
    if (!isAuthed && !isLoading) {
      return <Navigate to={ROUTES.login} replace state={{ from: location }} />;
    }
    if (isAuthed && !isLoading) {
      return children;
    }
  }

  return null;
};

export const routes = [
  {
    path: ROUTES.login,
    Component: AuthorizationPage,
    fetchData: initAuthPage,
  },
  {
    path: ROUTES.signup,
    Component: RegistrationPage,
    fetchData: initRegistrationPage,
  },
  {
    path: ROUTES.main,
    element: (
      <ProtectedRoute>
        <MainPage />
      </ProtectedRoute>
    ),
    fetchData: initMainPage,
  },
  {
    path: ROUTES.profile,
    element: (
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    ),
    fetchData: initProfilePage,
  },
  {
    path: ROUTES.password,
    element: (
      <ProtectedRoute>
        <PasswordChange />
      </ProtectedRoute>
    ),
    fetchData: initPasswordChangePage,
  },
  {
    path: ROUTES.game,
    element: (
      <ProtectedRoute>
        <GamePage />
      </ProtectedRoute>
    ),
    fetchData: initGamePage,
  },
  {
    path: ROUTES.leaderboard,
    element: (
      <ProtectedRoute>
        <LeaderboardPage />
      </ProtectedRoute>
    ),
    fetchData: initLeaderBoardPage,
  },
  {
    path: ROUTES.forum,
    element: (
      <ProtectedRoute>
        <ForumPage />
      </ProtectedRoute>
    ),
    fetchData: initForumPage,
  },
  {
    path: ROUTES.topic,
    element: (
      <ProtectedRoute>
        <TopicPage />
      </ProtectedRoute>
    ),
    fetchData: initTopicPage,
  },
  {
    path: ROUTES.error500,
    Component: Error500,
    fetchData: initErrorPage,
  },
  {
    path: '*',
    element: (
      <ProtectedRoute>
        <NotFoundPage />
      </ProtectedRoute>
    ),
    fetchData: initNotFoundPage,
  },
];
