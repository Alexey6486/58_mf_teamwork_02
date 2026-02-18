import * as Yup from 'yup';
import type { StringSchemaValueType } from '../types'

export const requiredString = (rule?: Yup.StringSchema<StringSchemaValueType, object>) => (
  (rule || Yup.string())
    .nullable()
    .test(
      'string-required',
      'Обязательно для заполнения',
      (value) => value !== undefined && value !== null && value.trim().length > 0,
    )
);
