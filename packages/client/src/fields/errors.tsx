import { type ReactNode } from 'react';
import { isArray } from 'lodash-es';
import { type FieldMetaProps, isObject } from 'formik';

interface IError {
  error: boolean;
  helperText?: string | ReactNode;
}

export const getError = (
  meta: FieldMetaProps<unknown>,
  helperText?: string | ReactNode
): IError => {
  const text = meta.error || meta.initialError;
  const isError = (meta.touched || meta.initialTouched) && Boolean(text);
  const errorText = isArray(text)
    ? text.map(item => <span>{item}</span>)
    : isObject(text)
    ? Object.values(text)
        .filter(Boolean)
        .map((item, index) => <span key={index + item}>{item}</span>)
    : text;

  return {
    error: isError,
    helperText: isError ? errorText : helperText || ' ',
  };
};
