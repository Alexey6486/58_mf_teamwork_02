import { type FC, type MouseEvent, type ChangeEvent, useEffect } from 'react';
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
import { type AppDispatch, useSelector } from '../../store/store';
import {
  changeUserAvatarThunk,
  changeUserDataThunk,
  selectUser,
  setUsers,
} from '../../slices/user-slice';
import { type IUser } from '../../types';
import { URL_BASE_IMG } from '../../constants/urls';
import {
  PageInitArgs,
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
import { logoutThunk } from '../../slices/auth-slice';
import { LS_KEY } from '../../constants/auth';
import { IconButton } from '../../components/IconButton';
import { EIconButton } from '../../enums';
import { initAuthPage } from '../authorization/Authorization'

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

  useEffect(() => {
    const user = localStorage.getItem(LS_KEY);
    if (user) {
      dispatch(setUsers(JSON.parse(user)));
    }
  }, []);

  return (
    <div className={MAIN_CONTAINER_CLASS}>
      <div className={FORM_PAGE_CONTAINER_CLASS}>
        <div className={FORM_CONTAINER_CLASS}>
          <div className="w-full flex justify-between absolute pl-8 pr-8 top-12 left-0">
            <IconButton
              onClick={toMain}
              iconName={EIconButton.BACK}
              hoverName={'На главную страницу'}
            />
            <IconButton
              onClick={handleLogout}
              iconName={EIconButton.OUT}
              hoverName={'Выйти из профиля'}
            />
          </div>
          <h3 className={FORM_TITLE_CLASS}>Профиль</h3>
          <div className={FORM_WRAPPER_CLASS}>
            <div className="w-full flex flex-col justify-center items-center mb-5">
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
              <div className={BTN_GROUP_CLASS}>
                <button
                  className={BTN_CLASS}
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
        </div>
      </div>
    </div>
  );
};

export const initProfilePage = async (_: PageInitArgs) => Promise.resolve();
