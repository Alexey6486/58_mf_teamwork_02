const API_PATH = '/api/v2';
const YANDEX_API_HOST =
  typeof __YP_API_BASE__ !== 'undefined'
    ? __YP_API_BASE__.replace('/api/v2', '')
    : 'https://ya-praktikum.tech';

export const URL_BASE =
  typeof window !== 'undefined' ? API_PATH : `${YANDEX_API_HOST}${API_PATH}`;
export const URL_BASE_IMG = `${URL_BASE}/resources`;
export const URL_USER_DATA = `/auth/user`;
export const URL_LOGIN = `/auth/signin`;
export const URL_SIGNUP = `/auth/signup`;
export const URL_LOGOUT = `/auth/logout`;
export const URL_PROFILE = `/user/profile`;
export const URL_AVATAR = `/user/profile/avatar`;
export const URL_PSW = `/user/password`;
export const URL_OAUTH_SERVICE_ID = `/oauth/yandex/service-id`;
export const URL_OAUTH_YANDEX = `/oauth/yandex`;
export const OAUTH_REDIRECT_URI =
  typeof __OAUTH_REDIRECT_URI__ !== 'undefined'
    ? __OAUTH_REDIRECT_URI__
    : 'http://localhost:3000';
export const OAUTH_YANDEX_URL =
  typeof __OAUTH_YANDEX_URL__ !== 'undefined'
    ? __OAUTH_YANDEX_URL__
    : 'https://oauth.yandex.ru/authorize';
export const URL_LEADERBOARD = `/leaderboard`;
export const SERVER_URI =
  (typeof __EXTERNAL_SERVER_URL__ !== 'undefined'
    ? __EXTERNAL_SERVER_URL__
    : 'http://localhost:3001') + '/api/v1';
