import { type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../routes';

import styles from './styles.module.scss';

export const RegistrationPage: FC = () => {
  const navigate = useNavigate();

  const toAuthorization = () => {
    navigate(ROUTES.authorization);
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <h3>Регистрация</h3>
        <div className={styles.form}>
          <div className={styles.buttons}>
            <button onClick={toAuthorization}>Назад</button>
          </div>
        </div>
      </div>
    </div>
  );
};
