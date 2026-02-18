import { type FC } from 'react';
// import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { useFormik, FormikProvider } from 'formik'
import { requiredString } from '../../validations'
import { Fields } from '../../fields';
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
  first_name: requiredString(),
});

export const ProfilePage: FC = () => {
  // const dispatch = useDispatch();

  const formik = useFormik<Partial<IUser>>({
    initialValues: INITIAL_VALUES,
    validationSchema: profileFormSchema,
    validateOnMount: true,
    enableReinitialize: true,
    onSubmit: () => {
      formik.setSubmitting(false);
      // dispatch();
    },
  });

  // const onSubmitForm = () => {
  //   formik.handleSubmit();
  // };

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
                characterLimit={10}
              />
            </div>
            <div className={styles.field}>
              <Fields.Text
                name="display_name"
                type="text"
                label="Ник"
                placeholder="Ник"
                characterLimit={10}
              />
            </div>
            <div className={styles.field}>
              <Fields.Text
                name="login"
                type="text"
                label="Логин"
                placeholder="Логин"
                characterLimit={10}
              />
            </div>
            <div className={styles.field}>
              <Fields.Text
                name="email"
                type="email"
                label="Почта"
                placeholder="Почта"
                characterLimit={10}
              />
            </div>
            <div className={styles.field}>
              <Fields.Text
                name="phone"
                type="text"
                label="Телефон"
                placeholder="Телефон"
                characterLimit={10}
              />
            </div>
            <div className={styles.buttons}>
              <button>Сохранить</button>
              <button>Назад</button>
            </div>
          </FormikProvider>
        </div>
      </div>
    </div>
  );
};
