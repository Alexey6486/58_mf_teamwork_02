import { type FC } from 'react';
// import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { useFormik, FormikProvider } from 'formik'
import { requiredString } from '../validations'
import { Fields } from '../fields';

interface IUser {
  first_name: string
}

const INITIAL_VALUES = {
  first_name: '',
};

export const profileFormSchema = Yup.object().shape({
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
      // dispatch(RegistrationCodeDictionaryRedux.Actions.editRegCode(values));
    },
  });
  // console.log({ v: formik });

  // const onSubmitForm = () => {
  //   formik.handleSubmit();
  // };

  return (
    <div>
      <FormikProvider value={formik}>
        Profile 1
        <Fields.Text
          name="first_name"
          type="text"
          label="Имя"
          placeholder="Имя"
          characterLimit={10}
        />
      </FormikProvider>
    </div>
  );
};
