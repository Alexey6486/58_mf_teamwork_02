import { type FC, type MouseEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { FormikProvider, useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import type { IAuthorizationForm } from '../../types';
import {
  REGEX,
  VALIDATION_MSG,
  regexpValidation,
  requiredString,
} from '../../validations';
import { Fields } from '../../fields';
import { ROUTES } from '../../routes';
import {
  APP_TITLE_CLASS,
  BTN_CLASS,
  BTN_GROUP_CLASS,
  FIELD_CLASS,
  FIELD_GROUP_CLASS,
  FORM_CONTAINER_CLASS,
  FORM_PAGE_CONTAINER_CLASS,
  FORM_WRAPPER_CLASS,
} from '../../constants/style-groups';
import { type AppDispatch, useSelector } from '../../store/store';
import { loginThunk } from '../../slices/auth-slice';
import { selectUser } from '../../slices/user-slice';
import { useIsAuthed } from '../../hooks';

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
  const { isAuthed } = useIsAuthed();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const formik = useFormik<IAuthorizationForm>({
    initialValues: INITIAL_VALUES,
    validationSchema: passwordFormSchema,
    validateOnMount: true,
    enableReinitialize: true,
    onSubmit: values => {
      formik.setSubmitting(false);
      dispatch(loginThunk(values));
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

  useEffect(() => {
    if (isAuthed || (user !== null && user.id)) {
      navigate(ROUTES.main);
    }
  }, [isAuthed, user]);

  return (
    <div className={FORM_PAGE_CONTAINER_CLASS}>
      <div className={FORM_CONTAINER_CLASS}>
        <h3 className={APP_TITLE_CLASS}>Flip 7</h3>
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
  );
};
