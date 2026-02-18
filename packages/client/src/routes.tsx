import type { AppDispatch, RootState } from './store'

import { initMainPage, MainPage } from './pages/Main'
import { ProfilePage } from './pages'
import { initFriendsPage, FriendsPage } from './pages/FriendsPage'
import { initNotFoundPage, NotFoundPage } from './pages/NotFound'

export type PageInitContext = {
  clientToken?: string
}

export type PageInitArgs = {
  dispatch: AppDispatch
  state: RootState
  ctx: PageInitContext
}

export const routes = [
  {
    path: '/profile',
    Component: ProfilePage,
    fetchData: () => null,
  },
  {
    path: '/',
    Component: MainPage,
    fetchData: initMainPage,
  },
  {
    path: '/friends',
    Component: FriendsPage,
    fetchData: initFriendsPage,
  },
  {
    path: '*',
    Component: NotFoundPage,
    fetchData: initNotFoundPage,
  },
]
