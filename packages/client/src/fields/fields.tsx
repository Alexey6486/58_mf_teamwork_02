import { useState, type ReactElement, type ChangeEvent } from 'react'
import {
  Field,
  type FieldAttributes,
  type FormikErrors,
  type FormikValues
} from 'formik'
import { getError } from './errors'
import type { FieldMetaProps } from 'formik/dist/types'

export interface IInputProps {
  disabled: boolean
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
}: FieldAttributes<TextFieldProps> & { showTextCounter: boolean; onChangeShowCounter: (value: boolean) => void }) => (
  {
    field,
    form,
    meta,
  }: {
    field: {
      name: string,
      value: string,
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
  // console.log({
  //   field,
  //   form,
  //   meta,
  // })
  const error = getError(meta, helperText);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    form.setFieldValue(field.name, e.target.value);
  }

  const handleFocus = () => {
    onChangeShowCounter(true);
  }

  const handleBlur = () => {
    onChangeShowCounter(false);
  }

  return (
    <>
      {label && (
        <label>
          {label}
        </label>
      )}
      <input type='text' onChange={handleChange} value={field.value || ''} onFocus={handleFocus} onBlur={handleBlur} />
      <div>
        <div>{error?.helperText}</div>
        {characterLimit && showTextCounter && (
          <div>{`${(field.value || '').length}/${characterLimit}`}</div>
        )}
      </div>
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
