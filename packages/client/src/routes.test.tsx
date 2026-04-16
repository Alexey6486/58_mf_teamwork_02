import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ProtectedRoute, ROUTES } from './routes';
import { userSlice, type UserState } from './slices/user-slice';

const ProfilePageText = 'Profile Page';
const AuthorizationPageText = 'Authorization Page';
const ProfilePageTest = () => <div>{ProfilePageText}</div>;
const AuthorizationPageTest = () => <div>{AuthorizationPageText}</div>;

const createTestStore = (preloadState: { user: UserState }) => {
  return configureStore({
    reducer: {
      user: userSlice.reducer,
    },
    preloadedState: {
      user: preloadState.user,
    },
  });
};

const renderWithProviders = (
  component: React.ReactElement,
  {
    route = ROUTES.login,
    preloadState = {
      user: {
        data: null,
        score: 0,
        theme: null,
        isLoading: false,
        error: {
          status: null,
          message: null,
          data: null,
        },
      },
    },
  }: {
    route: string;
    preloadState: { user: UserState } | undefined;
  }
) => {
  window.history.pushState({}, 'Test page', route);

  return render(
    <Provider store={createTestStore(preloadState)}>
      <BrowserRouter>{component}</BrowserRouter>
    </Provider>
  );
};

describe('Jest ProtectedRoute component test', () => {
  test('if there is no user data in state - redirect to authorization page', () => {
    renderWithProviders(
      <Routes>
        <Route path={ROUTES.login} element={<AuthorizationPageTest />} />
        <Route
          path={ROUTES.profile}
          element={
            <ProtectedRoute>
              <ProfilePageTest />
            </ProtectedRoute>
          }
        />
      </Routes>,
      { route: ROUTES.profile, preloadState: undefined }
    );

    expect(screen.getByText(AuthorizationPageText)).toBeInTheDocument();
    expect(screen.queryByText(ProfilePageText)).not.toBeInTheDocument();
  });

  test('if there is user data in state - render protected component', () => {
    renderWithProviders(
      <Routes>
        <Route path={ROUTES.login} element={<AuthorizationPageTest />} />
        <Route
          path={ROUTES.profile}
          element={
            <ProtectedRoute>
              <ProfilePageTest />
            </ProtectedRoute>
          }
        />
      </Routes>,
      {
        route: ROUTES.profile,
        preloadState: {
          user: {
            data: {
              id: '1',
              email: 'john@mail.com',
              first_name: 'John',
            },
            isLoading: false,
            score: 80,
            theme: null,
            error: {
              status: null,
              message: null,
              data: null,
            },
          },
        },
      }
    );

    expect(screen.queryByText(AuthorizationPageText)).not.toBeInTheDocument();
    expect(screen.getByText(ProfilePageText)).toBeInTheDocument();
  });
});
