import * as Yup from 'yup'

export const confirmedPasswordValidation = (message?: string) => (
  Yup.string()
    .nullable()
    .test(
      'string-required',
      message || 'Ошибка валидации',
      (value, context) => {
        return value === context.parent.newPassword;
      },
    )
);
