import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ErrorBoundary } from 'react-error-boundary';

import { store } from './store/store';
import { routes } from './routes';
import { ErrorFallback } from './components/ErrorFallback';
import { IdleObserver } from './components/idle-observer/idle-observer';
import '../style.css';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then(registration => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      })
      .catch(error => {
        console.error('ServiceWorker registration failed: ', error);
      });
  });
}

const router = createBrowserRouter(routes);

ReactDOM.hydrateRoot(
  document.getElementById('root') as HTMLElement,
  <Provider store={store}>
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <RouterProvider router={router} />
      <IdleObserver />
    </ErrorBoundary>
  </Provider>
);
