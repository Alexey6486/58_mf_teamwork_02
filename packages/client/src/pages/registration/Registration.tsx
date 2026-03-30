import { type FC, type MouseEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { useFormik, FormikProvider } from 'formik';
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
import {
  type PageInitArgs,
  ROUTES
} from '../../routes'
import {
  BTN_CLASS,
  BTN_GROUP_CLASS,
  FIELD_CLASS,
  FIELD_PR_CLASS,
  FORM_CONTAINER_CLASS,
  FORM_PAGE_CONTAINER_CLASS,
  FORM_TITLE_CLASS,
  FORM_WRAPPER_CLASS,
  MAIN_CONTAINER_CLASS,
} from '../../constants/style-groups';
import { selectUser } from '../../slices/user-slice';
import { signupThunk } from '../../slices/auth-slice';
import { IconButton } from '../../components/IconButton';
import { EIconButton } from '../../enums';

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
    <div className={MAIN_CONTAINER_CLASS}>
      <div className={FORM_PAGE_CONTAINER_CLASS}>
        <div className={FORM_CONTAINER_CLASS}>
          <div className="w-full flex justify-between absolute pl-8 pr-8 top-12 left-0">
            <IconButton
              onClick={toAuthorization}
              iconName={EIconButton.BACK}
              hoverName={'На страницу авторизации'}
            />
          </div>
          <h3 className={FORM_TITLE_CLASS}>Регистрация</h3>
          <div className={FORM_WRAPPER_CLASS}>
            <FormikProvider value={formik}>
              <div className="flex flex-col">
                <div className="w-full flex">
                  <div className={FIELD_PR_CLASS}>
                    <Fields.Text
                      name="first_name"
                      type="text"
                      label="Имя"
                      placeholder="Имя"
                    />
                  </div>
                  <div className={FIELD_CLASS}>
                    <Fields.Text
                      name="second_name"
                      type="text"
                      label="Фамилия"
                      placeholder="Фамилия"
                    />
                  </div>
                </div>
                <div className="w-full flex">
                  <div className={FIELD_PR_CLASS}>
                    <Fields.Text
                      name="login"
                      type="text"
                      label="Логин"
                      placeholder="Логин"
                    />
                  </div>
                  <div className={FIELD_CLASS}>
                    <Fields.Text
                      name="email"
                      type="email"
                      label="Почта"
                      placeholder="Почта"
                    />
                  </div>
                </div>
                <div className="w-full flex">
                  <div className={FIELD_PR_CLASS}>
                    <Fields.Text
                      name="phone"
                      type="text"
                      label="Телефон"
                      placeholder="Телефон"
                    />
                  </div>
                </div>
                <div className="w-full flex">
                  <div className={FIELD_PR_CLASS}>
                    <Fields.Text
                      name="newPassword"
                      type="password"
                      label="Пароль"
                      placeholder="Пароль"
                    />
                  </div>
                  <div className={FIELD_CLASS}>
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
        </div>
      </div>
    </div>
  );
};

export const initRegistrationPage = async (_: PageInitArgs) => Promise.resolve();
