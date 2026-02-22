import { type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../routes';

export const RegistrationPage: FC = () => {
  const navigate = useNavigate();

  const toAuthorization = () => {
    navigate(ROUTES.login);
  };

  return (
    <div className="">
      <div className="">
        <h3>Регистрация</h3>
        <div className="">
          <div className="">
            <button onClick={toAuthorization}>Назад</button>
          </div>
        </div>
      </div>
    </div>
  );
};
