import { useState, type ReactElement } from 'react'
import {
  Field,
  type FieldAttributes,
} from 'formik';
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
                   }: FieldAttributes<TextFieldProps> & { showTextCounter: boolean; onChangeShowCounter: (value: boolean) => void }) => (
  {
    field,
    form,
    meta,
  }: { field: unknown, form: unknown, meta: FieldMetaProps<unknown> },
) => {
  console.log({
    field,
    form,
    meta,
  })
  const error = getError(meta, helperText);
// onFocus = () => onChangeShowCounter(true)
// onBlur = () => onChangeShowCounter(false)
  return (
    <>
      {label && (
        <label>
          {label}
        </label>
      )}
      <input type='text' />
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
