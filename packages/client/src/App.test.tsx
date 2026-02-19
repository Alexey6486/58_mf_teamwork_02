import App from './App'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux';
import { type AnyAction, configureStore, type ThunkMiddleware } from '@reduxjs/toolkit';
import type { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore'
import { userSlice } from './slices/user-slice'

const appContent = 'Пользователь не найден!'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
global.fetch = jest.fn(() =>
  Promise.resolve({ json: () => Promise.resolve('hey') })
)

describe('Example test', () => {
  let store: ToolkitStore<unknown, AnyAction, [ThunkMiddleware<unknown, AnyAction, undefined>]>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        user: userSlice.reducer,
      },
      preloadedState: {
        user: undefined,
      },
    });
  });

  test('App test', () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    expect(screen.getByText(appContent)).toBeDefined()
  });
});
