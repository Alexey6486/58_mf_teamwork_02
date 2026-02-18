import { useState, type ReactElement, type ChangeEvent, type FocusEvent } from 'react'
import {
  Field,
  type FieldAttributes,
  type FormikErrors,
  type FormikValues
} from 'formik'
import { getError } from './errors'
import type { FieldMetaProps } from 'formik/dist/types'
import styles from './styles.module.scss';

export interface IInputProps {
  disabled?: boolean
  type?: boolean
  placeholder?: boolean
}

export type TextFieldProps = FieldAttributes<IInputProps> & {
  regex?: RegExp;
  label?: string;
  characterLimit?: number;
  helperText?: string;
  isUpperCase?: boolean;
  tag?: string;
  width?: string;
  height?: string;
  padding?: string;
}

const TextField = ({
  helperText,
  label,
  characterLimit,
  showTextCounter,
  onChangeShowCounter,
  type,
  // placeholder,
  // disabled,
}: FieldAttributes<TextFieldProps> & { showTextCounter: boolean; onChangeShowCounter: (value: boolean) => void }) => (
  {
    field,
    form,
    meta,
  }: {
    field: {
      name: string,
      value: string,
      onBlur: (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>) => void
    },
    form: {
      setFieldValue: (
        field: string,
        value: string,
        shouldValidate?: boolean | undefined,
      ) => Promise<FormikErrors<FormikValues>> | Promise<void>;
    },
    meta: FieldMetaProps<unknown>,
  },
) => {
  const error = getError(meta, helperText);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    form.setFieldValue(field.name, e.target.value);
  }

  const handleFocus = () => {
    onChangeShowCounter(true);
  }

  const handleBlur = (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>) => {
    onChangeShowCounter(false);
    field?.onBlur?.(event);
  }

  return (
    <>
      {label && (
        <label className={styles.label}>
          {label}
        </label>
      )}
      <input className={styles.input} name={field.name} type={type} onChange={handleChange} value={field.value || ''} onFocus={handleFocus} onBlur={handleBlur} />
      {(error?.error && error?.helperText) && (
        <div className={styles.error}>{error?.helperText}</div>
      )}
      {characterLimit && showTextCounter && (
        <div className={styles.limit}>{`${(field.value || '').length}/${characterLimit}`}</div>
      )}
    </>
  );
};

export const Fields = {
  Text: (props: FieldAttributes<TextFieldProps>): ReactElement => {
    const [showTextCounter, setFocused] = useState(false);

    return (
      <Field {...props} showTextCounter={showTextCounter}>
        {TextField({
          ...props,
          onChangeShowCounter: setFocused,
          showTextCounter,
        })}
      </Field>
    );
  },
};
