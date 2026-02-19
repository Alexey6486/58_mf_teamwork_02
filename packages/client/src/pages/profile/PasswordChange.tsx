import {
  type FC,
  type MouseEvent
} from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FormikProvider,
  useFormik
} from 'formik';
import * as Yup from 'yup';
import {
  type IUserPassword
} from '../../types';
import {
  changeUserPasswordThunk
} from '../../slices/user-slice';
import {
  REGEX,
  VALIDATION_MSG,
  regexpValidation,
  requiredString,
  confirmedPasswordValidation
} from '../../validations';
import { useDispatch } from 'react-redux';
import { type AppDispatch } from '../../store';
import { Fields } from '../../fields';
import { ROUTES } from '../../routes';
import styles from './styles.module.scss';

const INITIAL_VALUES: Partial<IUserPassword> = {
  oldPassword: '',
  newPassword: '',
  confirmedPassword: '',
};

const passwordFormSchema = Yup.object().shape({
  oldPassword: requiredString()
    .concat(regexpValidation(REGEX.psw, VALIDATION_MSG.psw)),
  newPassword: requiredString()
    .concat(regexpValidation(REGEX.psw, VALIDATION_MSG.psw)),
  confirmedPassword: requiredString()
    .concat(confirmedPasswordValidation(VALIDATION_MSG.c_psw)),
});

export const PasswordChange: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const formik = useFormik<Partial<IUserPassword>>({
    initialValues: INITIAL_VALUES,
    validationSchema: passwordFormSchema,
    validateOnMount: true,
    enableReinitialize: true,
    onSubmit: (values) => {
      formik.setSubmitting(false);
      dispatch(changeUserPasswordThunk({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      }));
      formik.resetForm();
    },
  });

  const onSubmitForm = (event: MouseEvent<HTMLButtonElement>) => {
    event?.preventDefault();
    formik?.handleSubmit();
  };

  const toProfile = () => {
    navigate(ROUTES.profile);
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <h3>Изменить пароль</h3>
        <div className={styles.form}>
          <FormikProvider value={formik}>
            <div className={styles.field}>
              <Fields.Text
                name="oldPassword"
                type="password"
                label="Старый пароль"
              />
            </div>
            <div className={styles.field}>
              <Fields.Text
                name="newPassword"
                type="password"
                label="Новый пароль"
              />
            </div>
            <div className={styles.field}>
              <Fields.Text
                name="confirmedPassword"
                type="password"
                label="Повторно новый пароль"
              />
            </div>

            <div className={styles.buttons}>
              <button type="submit" onClick={onSubmitForm}>Сохранить</button>
              <button onClick={toProfile}>Назад</button>
            </div>
          </FormikProvider>
        </div>
      </div>
    </div>
  );
};
