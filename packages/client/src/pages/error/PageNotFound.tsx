import { Link, useNavigate } from 'react-router-dom';
import {
  APP_TITLE_CLASS,
  FORM_PAGE_CONTAINER_CLASS,
} from '../../constants/style-groups';
import { type PageInitArgs, ROUTES } from '../../routes';
import { useSelector } from 'react-redux';
import { selectUserTheme } from '../../slices/user-slice';
import { useEffect, useState } from 'react';
import { ETheme } from '../../enums';
import { LS_THEME } from '../../constants/auth';
import { Button } from '../../components/Button';

export const PageNotFound = () => {
  const storeTheme = useSelector(selectUserTheme);
  const navigate = useNavigate();
  const [theme, setTheme] = useState<ETheme>(ETheme.light);

  const handleBack = () => {
    navigate(ROUTES.main);
  };

  useEffect(() => {
    if (storeTheme) {
      setTheme(storeTheme);
    } else if (localStorage && localStorage.getItem(LS_THEME)) {
      const lsTheme = localStorage.getItem(LS_THEME) as ETheme;
      setTheme(lsTheme);
    }
  }, [storeTheme]);

  return (
    <div className={FORM_PAGE_CONTAINER_CLASS}>
      <div className={`${FORM_PAGE_CONTAINER_CLASS} flex-col`}>
        <div className="flex mb-8">
          <img
            className="max-h-[200px] mr-4"
            src={`/images/cards/${
              theme === ETheme.light ? '4' : '4_light'
            }.svg`}
            alt="500"
          />
          <img
            className="max-h-[200px] mr-4"
            src={`/images/cards/${
              theme === ETheme.light ? '0' : '0_light'
            }.svg`}
            alt="500"
          />
          <img
            className="max-h-[200px]"
            src={`/images/cards/${
              theme === ETheme.light ? '4' : '4_light'
            }.svg`}
            alt="500"
          />
        </div>
        <div className="mb-6 dark:text-main-white">Страница не найдена</div>
        <Button onClick={handleBack} content="На главную" />
      </div>
    </div>
  );
};

export const initPageNotFound = async (_: PageInitArgs) => Promise.resolve();
