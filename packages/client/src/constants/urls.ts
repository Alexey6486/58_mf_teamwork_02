const isDev = process.env.NODE_ENV === 'development';

const FLIP7_SERVER_IP = '/api/v1';
const FLIP7_SERVER_LOCAL = 'http://localhost:3001/api/v1';
const YP_API = 'https://ya-praktikum.tech/api/v2';
const API_PATH = '/api/v2';

const SERVER_URI = isDev ? FLIP7_SERVER_LOCAL : FLIP7_SERVER_IP;

const YANDEX_API_HOST =
  typeof __YP_API_BASE__ !== 'undefined' ? __YP_API_BASE__ : YP_API;

const YP_URL_BASE = isDev ? YANDEX_API_HOST : API_PATH;

// const YANDEX_API_HOST =
//   typeof __YP_API_BASE__ !== 'undefined'
//     ? __YP_API_BASE__.replace(`${API_PATH}`, '')
//     : 'https://ya-praktikum.tech';

// export const YP_URL_BASE =
//   typeof window !== 'undefined'
//     ? API_PATH
//     : `${YANDEX_API_HOST}${API_PATH}`;

export const URL_BASE_IMG = `${YP_URL_BASE}/resources`;
export const URL_USER_DATA = `${YP_URL_BASE}/auth/user`;
export const URL_SIGNUP = `${YP_URL_BASE}/auth/signup`;
export const URL_LOGOUT = `${YP_URL_BASE}/auth/logout`;
export const URL_PROFILE = `${YP_URL_BASE}/user/profile`;
export const URL_AVATAR = `${YP_URL_BASE}/user/profile/avatar`;
export const URL_PSW = `${YP_URL_BASE}/user/password`;
export const URL_LEADERBOARD = `${YP_URL_BASE}/leaderboard`;
export const URL_OAUTH_SERVICE_ID = `${YP_URL_BASE}/oauth/yandex/service-id`;

export const URL_OAUTH_YANDEX = `${YP_URL_BASE}/oauth/yandex`;
export const OAUTH_YANDEX_URL = `https://oauth.yandex.ru/authorize`;
export const OAUTH_REDIRECT_URI =
  typeof window !== 'undefined' ? window.location.origin : '';

// export const SERVER_LOCAL =
//   (typeof __EXTERNAL_SERVER_URL__ !== 'undefined'
//     ? __EXTERNAL_SERVER_URL__
//     : 'http://localhost:3001') + '/api/v1';
// export const SERVER_URI = isDev
//   ? SERVER_LOCAL
//   : 'http://46.243.211.198:3001/api/v1';

export const URL_LOGIN = `${SERVER_URI}/auth/signin`;
export const URL_THEME = `${SERVER_URI}/theme`;
export const URL_FORUM_TOPICS = `${SERVER_URI}/forum/topics`;
export const URL_FORUM_TOPIC = `${SERVER_URI}/forum/topic`;
export const URL_FORUM_TOPIC_COMMENTS = (topicId: number | string) =>
  `${SERVER_URI}/forum/topic/${topicId}/comments`;
export const URL_FORUM_TOPIC_COMMENT = (topicId: number | string) =>
  `${SERVER_URI}/forum/topic/${topicId}/comment`;
export const URL_FORUM_TOPIC_COMMENT_REACTION = (
  topicId: number | string,
  commentId: number | string
) => `${SERVER_URI}/forum/topic/${topicId}/comment/${commentId}/reaction`;
