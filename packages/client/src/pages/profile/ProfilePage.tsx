import { type FC, type MouseEvent } from 'react';
// import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { useFormik, FormikProvider } from 'formik'
import { Fields } from '../../fields';
import {
  requiredString,
  regexpValidation,
  REGEX,
  VALIDATION_MSG
} from '../../validations'
import styles from './styles.module.scss';

interface IUser {
  first_name: string
  second_name: string
  display_name: string
  login: string
  email: string
  phone: string
}

const INITIAL_VALUES = {
  first_name: '',
  second_name: '',
  display_name: '',
  login: '',
  email: '',
  phone: ''
};

const profileFormSchema = Yup.object().shape({
  first_name: requiredString()
    .concat(regexpValidation(REGEX.name, VALIDATION_MSG.name)),
  // second_name: requiredString()
  //   .concat(regexpValidation(REGEX.name, VALIDATION_MSG.name)),
  // display_name: requiredString()
  //   .concat(regexpValidation(REGEX.name, VALIDATION_MSG.name)),
  // login: requiredString()
  //   .concat(regexpValidation(REGEX.login, VALIDATION_MSG.login)),
  // phone: requiredString()
  //   .concat(regexpValidation(REGEX.phone, VALIDATION_MSG.phone)),
  //
  //
  // email: regexpValidation(REGEX.email, VALIDATION_MSG.email),
});

export const ProfilePage: FC = () => {
  // const dispatch = useDispatch();

  const formik = useFormik<Partial<IUser>>({
    initialValues: INITIAL_VALUES,
    validationSchema: profileFormSchema,
    validateOnMount: true,
    enableReinitialize: true,
    onSubmit: (values) => {
      console.log({ values })
      formik.setSubmitting(false);
      // dispatch();
    },
  });

  const onSubmitForm = (event: MouseEvent<HTMLButtonElement>) => {
    event?.preventDefault();
    console.log('Submit');
    formik?.handleSubmit();
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <h3>Профиль</h3>
        <div className={styles.form}>
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
              <button type="submit" onClick={onSubmitForm}>Сохранить</button>
              <button>Назад</button>
            </div>
          </FormikProvider>
        </div>
      </div>
    </div>
  );
};
