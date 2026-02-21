import { type FC, type MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { FormikProvider, useFormik } from 'formik';
import type { IAuthorizationForm } from '../../types';
import {
  REGEX,
  VALIDATION_MSG,
  regexpValidation,
  requiredString,
} from '../../validations';
import { Fields } from '../../fields';
import { ROUTES } from '../../routes';

import styles from './styles.module.scss';

const INITIAL_VALUES: IAuthorizationForm = {
  login: '',
  password: '',
};

const passwordFormSchema = Yup.object().shape({
  login: requiredString().concat(
    regexpValidation(REGEX.login, VALIDATION_MSG.login)
  ),
  password: requiredString().concat(
    regexpValidation(REGEX.psw, VALIDATION_MSG.psw)
  ),
});

export const AuthorizationPage: FC = () => {
  const navigate = useNavigate();

  const formik = useFormik<IAuthorizationForm>({
    initialValues: INITIAL_VALUES,
    validationSchema: passwordFormSchema,
    validateOnMount: true,
    enableReinitialize: true,
    onSubmit: () => {
      formik.setSubmitting(false);
      formik.resetForm();
    },
  });

  const onSubmitForm = (event: MouseEvent<HTMLButtonElement>) => {
    event?.preventDefault();
    formik?.handleSubmit();
  };

  const toRegistration = () => {
    navigate(ROUTES.registration);
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <h3>Авторизация</h3>
        <div className={styles.form}>
          <FormikProvider value={formik}>
            <div className={styles.field}>
              <Fields.Text name="login" type="text" label="Логин" />
            </div>
            <div className={styles.field}>
              <Fields.Text name="password" type="password" label="Пароль" />
            </div>

            <div className={styles.buttons}>
              <button type="submit" onClick={onSubmitForm}>
                Авторизоваться
              </button>
              <button onClick={toRegistration}>Зарегистрироваться</button>
            </div>
          </FormikProvider>
        </div>
      </div>
    </div>
  );
};
