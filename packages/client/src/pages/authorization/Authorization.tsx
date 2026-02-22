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
    navigate(ROUTES.signup);
  };

  return (
    <div className="bg-cyan-200 h-screen flex justify-center items-center dark:bg-cyan-950">
      <div className="bg-slate-50 flex flex-col p-10 justify-center items-center w-80 border rounded shadow-lg dark:bg-slate-600">
        <h3 className="mb-6 text-lg font-bold text-black dark:text-white">
          Авторизация
        </h3>
        <div className="flex flex-col justify-between h-min-72 text-gray-400 dark:text-white">
          <FormikProvider value={formik}>
            <div className="flex flex-col mb-6">
              <div className="flex flex-col mb-6">
                <Fields.Text name="login" type="text" label="Логин" />
              </div>
              <div className="flex flex-col">
                <Fields.Text name="password" type="password" label="Пароль" />
              </div>
            </div>

            <div className="mt-6">
              <button
                className="text-black p-1 border rounded bg-sky-300 mb-6 w-full dark:bg-sky-900 dark:text-white"
                type="submit"
                onClick={onSubmitForm}>
                Авторизоваться
              </button>
              <button
                className="text-black p-1 border rounded bg-sky-300 w-full dark:bg-sky-900 dark:text-white"
                onClick={toRegistration}>
                Зарегистрироваться
              </button>
            </div>
          </FormikProvider>
        </div>
      </div>
    </div>
  );
};
