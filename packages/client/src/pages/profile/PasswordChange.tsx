import { type FC, type MouseEvent } from 'react';
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
import { type AppDispatch } from '../../store';
import { Fields } from '../../fields';
import { ROUTES } from '../../routes';
import {
  BTN_CLASS,
  BTN_GROUP_CLASS,
  FIELD_CLASS,
  FIELD_GROUP_CLASS,
  FORM_CONTAINER_CLASS,
  FORM_PAGE_CONTAINER_CLASS,
  FORM_TITLE_CLASS,
  FORM_WRAPPER_CLASS,
} from '../../constants/style-groups';

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
      <div className={FORM_CONTAINER_CLASS}>
        <h3 className={FORM_TITLE_CLASS}>Изменить пароль</h3>
        <div className={FORM_WRAPPER_CLASS}>
          <FormikProvider value={formik}>
            <div className={FIELD_GROUP_CLASS}>
              <div className={FIELD_CLASS}>
                <Fields.Text
                  name="oldPassword"
                  type="password"
                  label="Старый пароль"
                />
              </div>
              <div className={FIELD_CLASS}>
                <Fields.Text
                  name="newPassword"
                  type="password"
                  label="Новый пароль"
                />
              </div>
              <div className={FIELD_CLASS}>
                <Fields.Text
                  name="confirmedPassword"
                  type="password"
                  label="Повторно новый пароль"
                />
              </div>
            </div>
            <div className={BTN_GROUP_CLASS}>
              <button
                className={BTN_CLASS}
                type="submit"
                onClick={onSubmitForm}>
                Сохранить
              </button>
              <button className={BTN_CLASS} onClick={toProfile}>
                Назад
              </button>
            </div>
          </FormikProvider>
        </div>
      </div>
    </div>
  );
};
