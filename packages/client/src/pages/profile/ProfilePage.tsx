import React, { type FC, type MouseEvent, type ChangeEvent } from 'react';
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
} from '../../validations';
import { type AppDispatch, useSelector } from '../../store/store';
import {
  changeUserAvatarThunk,
  changeUserDataThunk,
  selectUser,
} from '../../slices/user-slice';
import { type IUser } from '../../types';
import { URL_BASE_IMG } from '../../constants/urls';
import { type PageInitArgs, ROUTES } from '../../routes';
import {
  BTN_CLASS,
  FIELD_CLASS,
  FIELD_PR_CLASS,
  FORM_PAGE_CONTAINER_CLASS,
  FORM_WRAPPER_CLASS,
  PAGE_TITLE_SIZE_CLASS,
} from '../../constants/style-groups';
import { logoutThunk } from '../../slices/auth-slice';
import { EIconButton } from '../../enums';
import { CardLayout } from '../../components/CardLayout';

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
      dispatch(changeUserAvatarThunk(formData));
    }
  };

  const toPasswordChange = () => {
    navigate(ROUTES.password);
  };

  const toMain = () => {
    navigate(ROUTES.main);
  };

  const handleLogout = () => {
    dispatch(logoutThunk());
  };

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Страница профиля</title>
        <meta name="description" content="Страница профиля" />
      </Helmet>
      <div className={FORM_PAGE_CONTAINER_CLASS}>
        <CardLayout
          text="ПРОФИЛЬ"
          textSize={PAGE_TITLE_SIZE_CLASS}
          bgColor="bg-f7-green"
          leftBtnCb={toMain}
          leftBtnIcon={EIconButton.BACK}
          leftBtnText="На главную страницу"
          rightBtnCb={handleLogout}
          rightBtnIcon={EIconButton.OUT}
          rightBtnText="Выйти из профиля">
          <div className={FORM_WRAPPER_CLASS}>
            <div className="w-full flex flex-col justify-center items-center -mt-[25px] mb-5">
              <div className="relative w-[100px] h-[100px] rounded-full bg-gray-200 cursor-pointer overflow-hidden group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="relative z-30 opacity-0 w-full h-full cursor-pointer"
                />
                <div className="absolute top-0 left-0 z-20 hidden group-hover:flex flex items-center justify-center w-full h-full bg-black/20 break-anywhere text-white text-center">
                  Поменять аватар
                </div>
                {user?.avatar && (
                  <img
                    className="absolute top-0 left-0 z-10 w-full h-full"
                    src={`${URL_BASE_IMG}${user.avatar}`}
                    alt="avatar"
                  />
                )}
              </div>
            </div>
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
                      name="login"
                      type="text"
                      label="Логин"
                      placeholder="Логин"
                    />
                  </div>
                </div>
                <div className="w-full flex">
                  <div className={FIELD_PR_CLASS}>
                    <Fields.Text
                      name="second_name"
                      type="text"
                      label="Фамилия"
                      placeholder="Фамилия"
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
                      name="display_name"
                      type="text"
                      label="Ник"
                      placeholder="Ник"
                    />
                  </div>
                  <div className={FIELD_CLASS}>
                    <Fields.Text
                      name="phone"
                      type="text"
                      label="Телефон"
                      placeholder="Телефон"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-4 flex w-full justify-between items-center">
                <button
                  className={`${BTN_CLASS} first:mb-0 mr-4`}
                  type="submit"
                  onClick={onSubmitForm}>
                  Сохранить
                </button>
                <button className={BTN_CLASS} onClick={toPasswordChange}>
                  Изменить пароль
                </button>
              </div>
            </FormikProvider>
          </div>
        </CardLayout>
      </div>
    </>
  );
};

export const initProfilePage = async (_: PageInitArgs) => Promise.resolve();
