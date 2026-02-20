import { type FC, type MouseEvent, type ChangeEvent } from 'react';
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
} from '../../validations';
import { type AppDispatch, useSelector } from '../../store';
import {
  changeUserAvatar,
  changeUserDataThunk,
  selectUser,
} from '../../slices/user-slice';
import type { IUser } from '../../types';
import { URL_BASE_IMG } from '../../constants/urls';
import { ROUTES } from '../../routes';
import styles from './styles.module.scss';

const INITIAL_VALUES: Partial<IUser> = {
  first_name: '',
  second_name: '',
  display_name: '',
  login: '',
  email: '',
  phone: '',
};

const profileFormSchema = Yup.object().shape({
  first_name: requiredString().concat(
    regexpValidation(REGEX.name, VALIDATION_MSG.name)
  ),
  second_name: requiredString().concat(
    regexpValidation(REGEX.name, VALIDATION_MSG.name)
  ),
  display_name: requiredString().concat(
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
});

export const ProfilePage: FC = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const formik = useFormik<Partial<IUser>>({
    initialValues: user || INITIAL_VALUES,
    validationSchema: profileFormSchema,
    validateOnMount: true,
    enableReinitialize: true,
    onSubmit: values => {
      formik.setSubmitting(false);
      dispatch(changeUserDataThunk(values));
    },
  });

  const onSubmitForm = (event: MouseEvent<HTMLButtonElement>) => {
    event?.preventDefault();
    formik?.handleSubmit();
  };

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (
      event.target &&
      event.target instanceof HTMLInputElement &&
      event.target.files
    ) {
      const formData = new FormData();
      formData.append('avatar', event.target.files[0]);
      dispatch(changeUserAvatar(formData));
    }
  };

  const toPasswordChange = () => {
    navigate(ROUTES.password);
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <h3>Профиль</h3>
        <div className={styles.form}>
          <div className={styles.avatar}>
            <div className={styles.image}>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
              />
              <div className={styles.mask}>Поменять аватар</div>
              {user?.avatar && (
                <img src={`${URL_BASE_IMG}${user.avatar}`} alt="avatar" />
              )}
            </div>
          </div>

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
              <button type="submit" onClick={onSubmitForm}>
                Сохранить
              </button>
              <button onClick={toPasswordChange}>Изменить пароль</button>
              <button>Назад</button>
            </div>
          </FormikProvider>
        </div>
      </div>
    </div>
  );
};
