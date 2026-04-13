import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { type AppDispatch, useSelector } from '../store/store';
import { selectUserTheme, setUserTheme } from '../slices/user-slice';
import { ETheme } from '../enums';
import { LS_THEME } from '../constants/auth';

// - в init state положить theme: light (в т.ч. для ssr)
// - при переключении темы на странице авторизации, сохранять в LS
// - далее на странице авторизации загружать тему из LS (если LS еще пустой, берем дефолтную темы из init state)
// - после первой авторизации (новый пользователь), при переключении темы, тема сохраняется в БД и LS
// - после последующих авторизаций этого пользователя тема загружается из БД

export const useTheme = () => {
  const theme = useSelector(selectUserTheme);
  const dispatch = useDispatch<AppDispatch>();

  console.log('useTheme', { theme });

  const setTheme = (theme: ETheme) => () => {
    console.log('useTheme setTheme', { theme });

    dispatch(setUserTheme(theme));
    localStorage.setItem(LS_THEME, theme);
  };

  useEffect(() => {
    const root = document?.documentElement;
    console.log('useTheme uf', { root });

    if (root) {
      if (root.classList.contains(ETheme.light)) {
        root.classList.remove(ETheme.light);
      }

      if (root.classList.contains(ETheme.dark)) {
        root.classList.remove(ETheme.dark);
      }

      root.classList.add(theme);
    }
  }, [theme]);

  return { theme, setTheme };
};
