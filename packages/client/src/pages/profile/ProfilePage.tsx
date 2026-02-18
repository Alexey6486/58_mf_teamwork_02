import { type FC, type MouseEvent, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { useFormik, FormikProvider } from 'formik';
import { Fields } from '../../fields';
import {
  requiredString,
  regexpValidation,
  REGEX,
  VALIDATION_MSG
} from '../../validations';
import styles from './styles.module.scss';
import {
  type AppDispatch,
  useSelector
} from '../../store'
import {
  changeUserDataThunk,
  fetchUserThunk,
  selectUser
} from '../../slices/userSlice';
import type { IUser } from '../../types';
import { URL_BASE, URL_LOGIN, URL_LOGOUT } from '../../constants/urls';

const INITIAL_VALUES: Partial<IUser> = {
  first_name: '',
  second_name: '',
  display_name: '',
  login: '',
  email: '',
  phone: ''
};

const profileFormSchema = Yup.object().shape({
  first_name: requiredString()
    .concat(regexpValidation(REGEX.name, VALIDATION_MSG.name)),
  second_name: requiredString()
    .concat(regexpValidation(REGEX.name, VALIDATION_MSG.name)),
  display_name: requiredString()
    .concat(regexpValidation(REGEX.name, VALIDATION_MSG.name)),
  login: requiredString()
    .concat(regexpValidation(REGEX.login, VALIDATION_MSG.login)),
  email: requiredString()
    .concat(regexpValidation(REGEX.email, VALIDATION_MSG.email)),
  phone: requiredString()
    .concat(regexpValidation(REGEX.phone, VALIDATION_MSG.phone)),

  // email: regexpValidation(REGEX.email, VALIDATION_MSG.email),
});

export const ProfilePage: FC = () => {
  const user = useSelector(selectUser)
  const dispatch = useDispatch<AppDispatch>();
  console.log({ user })

  const formik = useFormik<Partial<IUser>>({
    initialValues: user || INITIAL_VALUES,
    validationSchema: profileFormSchema,
    validateOnMount: true,
    enableReinitialize: true,
    onSubmit: (values) => {
      console.log({ values })
      formik.setSubmitting(false);
      dispatch(changeUserDataThunk(values));
    },
  });

  const onSubmitForm = (event: MouseEvent<HTMLButtonElement>) => {
    event?.preventDefault();
    console.log('Submit');
    formik?.handleSubmit();
  };

  /* Удалить, для тестирования (начало) */
  useEffect(() => {
    dispatch(fetchUserThunk());
  }, []);

  const onLogin = async () => {
    const result = await fetch(
      `${URL_BASE}${URL_LOGIN}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          login: 'axel',
          password: 'baRKm1n0',
        }),
        credentials: 'include',
      },
    );
    console.log('login', { result });
  };

  const onLogout = async () => {
    const result = await fetch(
      `${URL_BASE}${URL_LOGOUT}`,
      {
        method: 'POST',
        credentials: 'include',
      },
    );
    console.log('logout', { result });
  };
  /* удалить, для тестирования (конец) */

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <h3>Профиль</h3>
        <div className={styles.form}>
          <FormikProvider value={formik}>
            <div className={styles.field}>
              <Fields.Text
                name="first_name"
                type="text"
                label="Имя"
                placeholder="Имя"
                characterLimit={10}
              />
            </div>
            <div className={styles.field}>
              <Fields.Text
                name="second_name"
                type="text"
                label="Фамилия"
                placeholder="Фамилия"
              />
            </div>
            <div className={styles.field}>
              <Fields.Text
                name="display_name"
                type="text"
                label="Ник"
                placeholder="Ник"
              />
            </div>
            <div className={styles.field}>
              <Fields.Text
                name="login"
                type="text"
                label="Логин"
                placeholder="Логин"
              />
            </div>
            <div className={styles.field}>
              <Fields.Text
                name="email"
                type="email"
                label="Почта"
                placeholder="Почта"
              />
            </div>
            <div className={styles.field}>
              <Fields.Text
                name="phone"
                type="text"
                label="Телефон"
                placeholder="Телефон"
              />
            </div>

            <div className={styles.buttons}>
              <button type="submit" onClick={onSubmitForm}>Сохранить</button>
              <button>Изменить пароль</button>
              <button>Назад</button>
              <button onClick={onLogin}>авторизоваться (тест)</button>
              <button onClick={onLogout}>выйти (тест)</button>
            </div>
          </FormikProvider>
        </div>
      </div>
    </div>
  );
};
