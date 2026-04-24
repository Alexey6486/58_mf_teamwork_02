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
  typeof window !== 'undefined' ? window.location.origin : '';
export const OAUTH_YANDEX_URL = `https://oauth.yandex.ru/authorize`;
export const URL_LEADERBOARD = `/leaderboard`;

const isDev = process.env.NODE_ENV === 'development';
export const SERVER_LOCAL =
  (typeof __EXTERNAL_SERVER_URL__ !== 'undefined'
    ? __EXTERNAL_SERVER_URL__
    : 'http://localhost:3001') + '/api/v1';
export const SERVER_URI = isDev
  ? SERVER_LOCAL
  : 'http://46.243.211.198:3001/api/v1';

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
export const URL_THEME = '/theme';
