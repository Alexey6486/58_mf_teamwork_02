import React from 'react';
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react';
import {
  BrowserRouter,
  Route,
  Routes
} from 'react-router-dom';
import { Provider } from 'react-redux';
import {
  configureStore,
} from '@reduxjs/toolkit';
import {
  ProtectedRoute,
  ROUTES
} from './routes';
import {
  userSlice,
} from './slices/user-slice';
import { LS_KEY } from './constants/auth';

const ProfilePageText = 'Profile Page';
const AuthorizationPageText = 'Authorization Page';
const ProfilePageTest = () => <div>{ProfilePageText}</div>;
const AuthorizationPageTest = () => <div>{AuthorizationPageText}</div>;

const createTestStore = () => {
  return configureStore({
    reducer: {
      user: userSlice.reducer,
    },
    preloadedState: {
      user: {
        data: null,
        isLoading: false,
        error: {
          status: null,
          message: null,
          data: null,
        },
      },
    },
  });
};

const renderWithProviders = (
  component: React.ReactElement,
  {
    route = ROUTES.login,
  } = {}
) => {
  window.history.pushState({}, 'Test page', route);

  return render(
    <Provider store={createTestStore()}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </Provider>
  );
};

describe('Jest ProtectedRoute component test', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('if there is no user data in localStorage - redirect to authorization page', () => {
    renderWithProviders(
      <Routes>
        <Route path={ROUTES.login} element={<AuthorizationPageTest />} />
        <Route path={ROUTES.profile} element={<ProtectedRoute><ProfilePageTest /></ProtectedRoute>} />
      </Routes>,
      { route: ROUTES.profile }
    );

    expect(screen.getByText(AuthorizationPageText)).toBeInTheDocument();
    expect(screen.queryByText(ProfilePageText)).not.toBeInTheDocument();
  });

  // test('if there is user data in localStorage - render protected component', () => {
  //   const mockUser = { id: '1', email: 'john@mail.com', first_name: 'John' };
  //   localStorage.setItem(LS_KEY, JSON.stringify(mockUser));
  //
  //   renderWithProviders(
  //     <Routes>
  //       <Route path={ROUTES.login} element={<AuthorizationPageTest />} />
  //       <Route path={ROUTES.profile} element={<ProtectedRoute><ProfilePageTest /></ProtectedRoute>} />
  //     </Routes>,
  //     { route: ROUTES.profile }
  //   );
  //
  //   expect(screen.queryByText(AuthorizationPageText)).not.toBeInTheDocument();
  //   expect(screen.getByText(ProfilePageText)).toBeInTheDocument();
  // });
});
