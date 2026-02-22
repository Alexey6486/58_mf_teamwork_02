import styles from './styles.module.scss';
import { Link } from 'react-router-dom'

export const NotFoundPage = () => {
  return (
    <div className={ styles.container }>
      <Link to="/" className={ styles.link }>Перейти на главную страницу</Link>
      <img className={ styles.img } src={ 'src/assets/images/404.png' } alt="404"/>
    </div>
  );
};

export const initNotFoundPage = () => Promise.resolve();
