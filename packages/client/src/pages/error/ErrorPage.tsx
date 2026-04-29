import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { FORM_PAGE_CONTAINER_CLASS } from '../../constants/style-groups';
import { type PageInitArgs, ROUTES } from '../../routes';
import { LS_THEME } from '../../constants/auth';
import { selectUserTheme } from '../../slices/user-slice';
import { ETheme } from '../../enums';
import { Button } from '../../components/Button';

export const ErrorPage = () => {
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
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Страница ошибки</title>
        <meta name="description" content="Страница ошибки" />
      </Helmet>
      <div className={`${FORM_PAGE_CONTAINER_CLASS} flex-col`}>
        <div className="flex mb-8">
          <img
            className="max-h-[200px] mr-4"
            src={`/images/cards/${
              theme === ETheme.light ? '5' : '5_light'
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
              theme === ETheme.light ? '0' : '0_light'
            }.svg`}
            alt="500"
          />
        </div>
        <div className="mb-6 dark:text-main-white">
          Ошибка, что-то пошло не так...
        </div>
        <Button onClick={handleBack} content="На главную" />
      </div>
    </>
  );
};

export const initErrorPage = async (_: PageInitArgs) => Promise.resolve();
