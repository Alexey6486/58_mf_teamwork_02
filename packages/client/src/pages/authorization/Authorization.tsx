import { type FC, type MouseEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { FormikProvider, useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet';
import { Logo } from '../../components/Logo/Logo';
import type { IAuthorizationForm } from '../../types';
import {
  REGEX,
  VALIDATION_MSG,
  regexpValidation,
  requiredString,
} from '../../validations';
import { Fields } from '../../fields';
import { type PageInitArgs, ROUTES } from '../../routes';
import {
  BTN_CLASS,
  BTN_GROUP_CLASS,
  FIELD_CLASS,
  FIELD_GROUP_CLASS,
  FORM_CONTAINER_CLASS,
  FORM_PAGE_CONTAINER_CLASS,
  FORM_WRAPPER_CLASS,
  MAIN_CONTAINER_CLASS,
} from '../../constants/style-groups';
import { type AppDispatch, useSelector } from '../../store/store';
import { loginThunk, logoutThunk } from '../../slices/auth-slice';
import { selectUser } from '../../slices/user-slice';
import { IconButton } from '../../components/IconButton';
import { EIconButton, ERequestMethods } from '../../enums';

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
  const user = useSelector(selectUser);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const formik = useFormik<IAuthorizationForm>({
    initialValues: INITIAL_VALUES,
    validationSchema: passwordFormSchema,
    validateOnMount: true,
    enableReinitialize: true,
    onSubmit: values => {
      formik.setSubmitting(false);
      // dispatch(loginThunk(values));

      const requestOptions = {
        method: ERequestMethods.POST,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          login: values?.login,
          password: values?.password,
        }),
        credentials: 'include' as RequestCredentials,
      };

      fetch('http://localhost:3001/api/v1/auth/signin', requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.error(error));

      formik.resetForm();
    },
  });

  const onSubmitForm = (event: MouseEvent<HTMLButtonElement>) => {
    event?.preventDefault();
    formik?.handleSubmit();
  };

  const toRegistration = () => {
    navigate(ROUTES.signup);
  };

  const handleLogout = () => {
    // dispatch(logoutThunk());
    const requestOptions = {
      method: ERequestMethods.POST,
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include' as RequestCredentials,
    };

    fetch('http://localhost:3001/api/v1/auth/signout', requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.error(error));
  };

  useEffect(() => {
    if (user) {
      navigate(ROUTES.main);
    }
  }, [user]);

  return (
    <div className={MAIN_CONTAINER_CLASS}>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Страница авторизации</title>
        <meta name="description" content="Страница авторизации" />
      </Helmet>
      <div className={FORM_PAGE_CONTAINER_CLASS}>
        <div className="absolute top-12 right-12 opacity-0">
          <IconButton
            onClick={handleLogout}
            iconName={EIconButton.OUT}
            hoverName={'Logout'}
          />
        </div>
        <div className={FORM_CONTAINER_CLASS}>
          <Logo />
          <div className={FORM_WRAPPER_CLASS}>
            <FormikProvider value={formik}>
              <div className={FIELD_GROUP_CLASS}>
                <div className={FIELD_CLASS}>
                  <Fields.Text name="login" type="text" label="Логин" />
                </div>
                <div className={FIELD_CLASS}>
                  <Fields.Text name="password" type="password" label="Пароль" />
                </div>
              </div>

              <div className={BTN_GROUP_CLASS}>
                <button
                  className={BTN_CLASS}
                  type="submit"
                  onClick={onSubmitForm}>
                  Авторизоваться
                </button>
                <button className={BTN_CLASS} onClick={toRegistration}>
                  Зарегистрироваться
                </button>
              </div>
            </FormikProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

export const initAuthPage = async (_: PageInitArgs) => Promise.resolve();
