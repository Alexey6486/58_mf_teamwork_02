import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store/store';
import { oauthGetServiceIdThunk, oauthYandexThunk } from '../slices/auth-slice';
import { fetchUserThunk } from '../slices/user-slice';
import { OAUTH_REDIRECT_URI, OAUTH_YANDEX_URL } from '../constants/urls';

export function useYandexOAuth() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code');
    if (code) {
      window.history.replaceState({}, '', window.location.pathname);
      dispatch(oauthYandexThunk({ code })).then(() => {
        dispatch(fetchUserThunk());
      });
    }
  }, []);

  const startOAuth = async () => {
    const result = await dispatch(oauthGetServiceIdThunk());
    if (oauthGetServiceIdThunk.fulfilled.match(result)) {
      const { service_id } = result.payload as { service_id: string };
      window.location.href =
        `${OAUTH_YANDEX_URL}?response_type=code&client_id=${service_id}&redirect_uri=${OAUTH_REDIRECT_URI}`;
    }
  };

  return { startOAuth };
}
