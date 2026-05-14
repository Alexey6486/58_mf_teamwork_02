import React, { type FC, type MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
import { type IUserPassword } from '../../types';
import { changeUserPasswordThunk } from '../../slices/user-slice';
import {
  REGEX,
  VALIDATION_MSG,
  regexpValidation,
  requiredString,
  confirmedPasswordValidation,
} from '../../validations';
import { useDispatch } from 'react-redux';
import { type AppDispatch } from '../../store/store';
import { Fields } from '../../fields';
import { type PageInitArgs, ROUTES } from '../../routes';
import {
  BTN_CLASS,
  FIELD_CLASS,
  FIELD_GROUP_CLASS,
  FORM_PAGE_CONTAINER_CLASS,
  FORM_WRAPPER_CLASS,
  PAGE_TITLE_SIZE_CLASS,
} from '../../constants/style-groups';
import { EIconButton } from '../../enums';
import { CardLayout } from '../../components/CardLayout';

const INITIAL_VALUES: Partial<IUserPassword> = {
  oldPassword: '',
  newPassword: '',
  confirmedPassword: '',
};

const passwordFormSchema = Yup.object().shape({
  oldPassword: requiredString().concat(
    regexpValidation(REGEX.psw, VALIDATION_MSG.psw)
  ),
  newPassword: requiredString().concat(
    regexpValidation(REGEX.psw, VALIDATION_MSG.psw)
  ),
  confirmedPassword: requiredString().concat(
    confirmedPasswordValidation(VALIDATION_MSG.c_psw)
  ),
});

export const PasswordChange: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const formik = useFormik<Partial<IUserPassword>>({
    initialValues: INITIAL_VALUES,
    validationSchema: passwordFormSchema,
    validateOnMount: true,
    enableReinitialize: true,
    onSubmit: values => {
      formik.setSubmitting(false);
      dispatch(
        changeUserPasswordThunk({
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
        })
      );
      formik.resetForm();
    },
  });

  const onSubmitForm = (event: MouseEvent<HTMLButtonElement>) => {
    event?.preventDefault();
    formik?.handleSubmit();
  };

  const toProfile = () => {
    navigate(ROUTES.profile);
  };

  return (
    <div className={FORM_PAGE_CONTAINER_CLASS}>
      <CardLayout
        text="ПАРОЛЬ"
        textSize={PAGE_TITLE_SIZE_CLASS}
        bgColor="bg-f7-pale-red"
        leftBtnCb={toProfile}
        leftBtnIcon={EIconButton.BACK}
        leftBtnText="На страницу профиля">
        <div className={FORM_WRAPPER_CLASS}>
          <FormikProvider value={formik}>
            <div className={`${FIELD_GROUP_CLASS} items-center mb-10`}>
              <div className={`${FIELD_CLASS} w-full`}>
                <Fields.Text
                  name="oldPassword"
                  type="password"
                  label="Старый пароль"
                />
              </div>
              <div className={`${FIELD_CLASS} w-full`}>
                <Fields.Text
                  name="newPassword"
                  type="password"
                  label="Новый пароль"
                />
              </div>
              <div className={`${FIELD_CLASS} w-full`}>
                <Fields.Text
                  name="confirmedPassword"
                  type="password"
                  label="Повторно новый пароль"
                />
              </div>
            </div>
            <div className="w-full flex justify-center">
              <button
                className={BTN_CLASS}
                type="submit"
                onClick={onSubmitForm}>
                Сохранить
              </button>
            </div>
          </FormikProvider>
        </div>
      </CardLayout>
    </div>
  );
};

export const initPasswordChangePage = async (_: PageInitArgs) =>
  Promise.resolve();
