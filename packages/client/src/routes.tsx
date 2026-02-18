import type { AppDispatch, RootState } from './store'

import { initMainPage, MainPage } from './pages/Main'
import {
  PasswordChange,
  ProfilePage
} from './pages'
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

export const ROUTES = {
  main: '/',
  profile: '/profile',
  password: '/profile/password',
}

export const routes = [
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
    path: ROUTES.main,
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
