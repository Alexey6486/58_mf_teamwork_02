import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { type AppDispatch, useSelector } from '../store/store';
import {
  changeUserTheme,
  selectUser,
  selectUserTheme,
  setUserTheme,
} from '../slices/user-slice';
import { ETheme } from '../enums';
import { LS_THEME } from '../constants/auth';

export const useTheme = () => {
  const user = useSelector(selectUser);
  const theme = useSelector(selectUserTheme);
  const dispatch = useDispatch<AppDispatch>();

  const setTheme = (theme: ETheme) => () => {
    localStorage.setItem(LS_THEME, theme);

    if (user?.id) {
      // id может не быть если пользователь не авторизован (страница регистрации/авторизации)
      dispatch(changeUserTheme({ userId: user.id, theme }));
    } else {
      dispatch(setUserTheme(theme));
    }
  };

  useEffect(() => {
    const root = document?.documentElement;
    const lsTheme = localStorage.getItem(LS_THEME);

    if (root) {
      if (root.classList.contains(ETheme.light)) {
        root.classList.remove(ETheme.light);
      }

      if (root.classList.contains(ETheme.dark)) {
        root.classList.remove(ETheme.dark);
      }

      // init state при ssr theme=null (в случае первой загрузки страници или при обновлении через f5)
      if (!theme) {
        // проверяем есть ли ls
        if (lsTheme) {
          // если есть, добавляем в state
          dispatch(setUserTheme(lsTheme as ETheme));
        } else {
          // если нет, добавляем в state и ls значение по умолчанию
          localStorage.setItem(LS_THEME, ETheme.light);
          dispatch(setUserTheme(ETheme.light));
        }
      } else {
        // если есть theme в state, применяем
        if (!lsTheme || lsTheme !== theme) {
          localStorage.setItem(LS_THEME, theme);
        }
        root.classList.add(theme);
      }
    }
  }, [theme]);

  return { theme, setTheme };
};
