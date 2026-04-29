import { Link } from 'react-router-dom';
import {
  APP_TITLE_CLASS,
  FORM_PAGE_CONTAINER_CLASS,
} from '../../constants/style-groups';
import { type PageInitArgs, ROUTES } from '../../routes';

export const NotFoundPage = () => {
  return (
    <div className={FORM_PAGE_CONTAINER_CLASS}>
      <div className="flex flex-col justify-center items-center">
        <Link
          to={ROUTES.main}
          className={`${APP_TITLE_CLASS} mb-[-50px] no-underline z-10`}>
          Перейти на главную страницу
        </Link>
        <img
          className="max-w-full max-h-[70vh] w-auto h-auto object-contain"
          src={'/images/404.png'}
          alt="404"
        />
      </div>
    </div>
  );
};

export const initNotFoundPage = async (_: PageInitArgs) => Promise.resolve();
