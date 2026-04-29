import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import type { AppDispatch, RootState } from './store/store';
import {
  AuthorizationPage,
  PasswordChange,
  ProfilePage,
  RegistrationPage,
  initPageNotFound,
  PageNotFound,
  ErrorPage,
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
import { logoutThunk } from './slices/auth-slice';
import { Layout } from './components/Layout';
import { ROUTES } from './constants/routes';

export { ROUTES } from './constants/routes';

export type PageInitContext = {
  clientToken?: string;
};

export type PageInitArgs = {
  dispatch: AppDispatch;
  state: RootState;
  ctx: PageInitContext;
};

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthed, isLoading } = useIsAuthed();
  const [shouldNavigate, setShouldNavigate] = useState(false);

  useEffect(() => {
    setShouldNavigate(true);
  }, []);

  if (shouldNavigate) {
    if (!isAuthed && !isLoading) {
      dispatch(logoutThunk());
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
    element: (
      <Layout>
        <AuthorizationPage />
      </Layout>
    ),
    fetchData: initAuthPage,
  },
  {
    path: ROUTES.signup,
    element: (
      <Layout>
        <RegistrationPage />
      </Layout>
    ),
    fetchData: initRegistrationPage,
  },
  {
    path: ROUTES.main,
    element: (
      <ProtectedRoute>
        <Layout>
          <MainPage />
        </Layout>
      </ProtectedRoute>
    ),
    fetchData: initMainPage,
  },
  {
    path: ROUTES.profile,
    element: (
      <ProtectedRoute>
        <Layout>
          <ProfilePage />
        </Layout>
      </ProtectedRoute>
    ),
    fetchData: initProfilePage,
  },
  {
    path: ROUTES.password,
    element: (
      <ProtectedRoute>
        <Layout>
          <PasswordChange />
        </Layout>
      </ProtectedRoute>
    ),
    fetchData: initPasswordChangePage,
  },
  {
    path: ROUTES.game,
    element: (
      <ProtectedRoute>
        <Layout>
          <GamePage />
        </Layout>
      </ProtectedRoute>
    ),
    fetchData: initGamePage,
  },
  {
    path: ROUTES.leaderboard,
    element: (
      <ProtectedRoute>
        <Layout>
          <LeaderboardPage />
        </Layout>
      </ProtectedRoute>
    ),
    fetchData: initLeaderBoardPage,
  },
  {
    path: ROUTES.forum,
    element: (
      <ProtectedRoute>
        <Layout>
          <ForumPage />
        </Layout>
      </ProtectedRoute>
    ),
    fetchData: initForumPage,
  },
  {
    path: ROUTES.topic,
    element: (
      <ProtectedRoute>
        <Layout>
          <TopicPage />
        </Layout>
      </ProtectedRoute>
    ),
    fetchData: initTopicPage,
  },
  {
    path: ROUTES.error500,
    element: (
      <Layout>
        <ErrorPage />
      </Layout>
    ),
    fetchData: initErrorPage,
  },
  {
    path: '*',
    element: (
      <ProtectedRoute>
        <Layout>
          <PageNotFound />
        </Layout>
      </ProtectedRoute>
    ),
    fetchData: initPageNotFound,
  },
];
