import * as Yup from 'yup';
import type { StringSchemaValueType } from '../types'

export const regexpValidation = (mask: RegExp, message: string) => Yup.string()
  .nullable()
  .test(
    'incorrect-format',
    message || 'Неверный формат',
    (value: StringSchemaValueType) => (value ? mask.test(value) : true),
  );
