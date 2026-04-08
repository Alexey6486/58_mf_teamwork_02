const API_PATH = '/api/v2';
const YANDEX_API_HOST = 'https://ya-praktikum.tech';

export const URL_BASE = typeof window !== 'undefined' ? API_PATH : `${YANDEX_API_HOST}${API_PATH}`;
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
export const OAUTH_REDIRECT_URI = 'http://localhost:3000';
export const OAUTH_YANDEX_URL = `https://oauth.yandex.ru/authorize`;
export const URL_LEADERBOARD = `/leaderboard`;
