import React, { type FC, type MouseEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { useFormik, FormikProvider } from 'formik';
import { Helmet } from 'react-helmet';
import { Fields } from '../../fields';
import {
  requiredString,
  regexpValidation,
  REGEX,
  VALIDATION_MSG,
  confirmedPasswordValidation,
} from '../../validations';
import { type AppDispatch, useSelector } from '../../store/store';
import { type IRegistrationForm } from '../../types';
import { type PageInitArgs, ROUTES } from '../../routes';
import {
  BTN_CLASS,
  BTN_GROUP_CLASS,
  FIELD_CLASS,
  FIELD_PR_CLASS,
  FIELD_WIDTH_288,
  FORM_PAGE_CONTAINER_CLASS,
  FORM_WRAPPER_CLASS,
  PAGE_TITLE_SIZE_CLASS,
} from '../../constants/style-groups';
import { selectUser } from '../../slices/user-slice';
import { signupThunk } from '../../slices/auth-slice';
import { EIconButton } from '../../enums';
import { CardLayout } from '../../components/CardLayout';

const INITIAL_VALUES: Partial<IRegistrationForm> = {
  first_name: '',
  second_name: '',
  login: '',
  email: '',
  phone: '',
  newPassword: '',
  confirmedPassword: '',
};

const registrationFormSchema = Yup.object().shape({
  first_name: requiredString().concat(
    regexpValidation(REGEX.name, VALIDATION_MSG.name)
  ),
  second_name: requiredString().concat(
    regexpValidation(REGEX.name, VALIDATION_MSG.name)
  ),
  login: requiredString().concat(
    regexpValidation(REGEX.login, VALIDATION_MSG.login)
  ),
  email: requiredString().concat(
    regexpValidation(REGEX.email, VALIDATION_MSG.email)
  ),
  phone: requiredString().concat(
    regexpValidation(REGEX.phone, VALIDATION_MSG.phone)
  ),
  newPassword: requiredString().concat(
    regexpValidation(REGEX.psw, VALIDATION_MSG.psw)
  ),
  confirmedPassword: requiredString().concat(
    confirmedPasswordValidation(VALIDATION_MSG.c_psw)
  ),
});

export const RegistrationPage: FC = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const formik = useFormik<Partial<IRegistrationForm>>({
    initialValues: INITIAL_VALUES,
    validationSchema: registrationFormSchema,
    validateOnMount: true,
    enableReinitialize: true,
    onSubmit: values => {
      formik.setSubmitting(false);
      dispatch(
        signupThunk({
          first_name: values.first_name,
          second_name: values.second_name,
          login: values.login,
          email: values.email,
          phone: values.phone,
          password: values.newPassword,
        })
      );
    },
  });

  const onSubmitForm = (event: MouseEvent<HTMLButtonElement>) => {
    event?.preventDefault();
    formik?.handleSubmit();
  };

  const toAuthorization = () => {
    navigate(ROUTES.login);
  };

  useEffect(() => {
    if (user) {
      navigate(ROUTES.main);
    }
  }, [user]);

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Страница регистрации</title>
        <meta name="description" content="Страница регистрации" />
      </Helmet>
      <div className={FORM_PAGE_CONTAINER_CLASS}>
        <CardLayout
          text="РЕГИСТРАЦИЯ"
          textSize={PAGE_TITLE_SIZE_CLASS}
          bgColor="bg-f7-pink"
          leftBtnCb={toAuthorization}
          leftBtnIcon={EIconButton.BACK}
          leftBtnText="На страницу авторизации">
          <div className={FORM_WRAPPER_CLASS}>
            <FormikProvider value={formik}>
              <div className="flex flex-col">
                <div className="w-full flex">
                  <div className={`${FIELD_PR_CLASS} ${FIELD_WIDTH_288}`}>
                    <Fields.Text
                      name="first_name"
                      type="text"
                      label="Имя"
                      placeholder="Имя"
                    />
                  </div>
                  <div className={`${FIELD_CLASS} ${FIELD_WIDTH_288}`}>
                    <Fields.Text
                      name="second_name"
                      type="text"
                      label="Фамилия"
                      placeholder="Фамилия"
                    />
                  </div>
                </div>
                <div className="w-full flex">
                  <div className={`${FIELD_PR_CLASS} ${FIELD_WIDTH_288}`}>
                    <Fields.Text
                      name="login"
                      type="text"
                      label="Логин"
                      placeholder="Логин"
                    />
                  </div>
                  <div className={`${FIELD_CLASS} ${FIELD_WIDTH_288}`}>
                    <Fields.Text
                      name="email"
                      type="email"
                      label="Почта"
                      placeholder="Почта"
                    />
                  </div>
                </div>
                <div className="w-full flex">
                  <div className={`${FIELD_PR_CLASS} ${FIELD_WIDTH_288}`}>
                    <Fields.Text
                      name="phone"
                      type="text"
                      label="Телефон"
                      placeholder="Телефон"
                    />
                  </div>
                </div>
                <div className="w-full flex">
                  <div className={`${FIELD_PR_CLASS} ${FIELD_WIDTH_288}`}>
                    <Fields.Text
                      name="newPassword"
                      type="password"
                      label="Пароль"
                      placeholder="Пароль"
                    />
                  </div>
                  <div className={`${FIELD_CLASS} ${FIELD_WIDTH_288}`}>
                    <Fields.Text
                      name="confirmedPassword"
                      type="password"
                      label="Повторно пароль"
                      placeholder="Повторно пароль"
                    />
                  </div>
                </div>
              </div>
              <div className={BTN_GROUP_CLASS}>
                <button
                  className={BTN_CLASS}
                  type="submit"
                  onClick={onSubmitForm}>
                  Зарегистрироваться
                </button>
              </div>
            </FormikProvider>
          </div>
        </CardLayout>
      </div>
    </>
  );
};

export const initRegistrationPage = async (_: PageInitArgs) =>
  Promise.resolve();
