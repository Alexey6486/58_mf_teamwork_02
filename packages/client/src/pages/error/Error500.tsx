import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import {
  APP_TITLE_CLASS,
  FORM_PAGE_CONTAINER_CLASS,
} from '../../constants/style-groups';
import { type PageInitArgs, ROUTES } from '../../routes';

export const Error500 = () => {
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Страница ошибки</title>
        <meta name="description" content="Страница ошибки" />
      </Helmet>
      <div className={`${FORM_PAGE_CONTAINER_CLASS} flex-col`}>
        <Link
          to={ROUTES.main}
          className={`${APP_TITLE_CLASS} mb-[-50px] no-underline z-10`}>
          Перейти на главную страницу
        </Link>
        <img
          className="max-w-full max-h-[70vh] w-auto h-auto object-contain"
          src={'/images/500.png'}
          alt="500"
        />
      </div>
    </>
  );
};

export const initErrorPage = async (_: PageInitArgs) => Promise.resolve();
