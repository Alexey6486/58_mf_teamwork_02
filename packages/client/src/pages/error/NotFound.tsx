import { Link } from 'react-router-dom';
import { APP_TITLE_CLASS } from '../../constants/style-groups'

export const NotFoundPage = () => {
  return (
    <div className="bg-main-light dark:bg-main-dark flex flex-col items-center min-h-screen p-5 box-border">
      <Link to="/" className={ `${APP_TITLE_CLASS} mt-[100px] no-underline` }>
        Перейти на главную страницу
      </Link>
      <img
        className="max-w-full max-h-[70vh] w-auto h-auto object-contain"
        src={'src/assets/images/404.png'}
        alt="404"
      />
    </div>
  );
};

export const initNotFoundPage = () => Promise.resolve();
