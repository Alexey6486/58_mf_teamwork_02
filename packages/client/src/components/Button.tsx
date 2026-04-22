import { type FC, type ReactNode } from 'react';
import { BTN_CLASS } from '../constants/style-groups';

type ButtonProps = {
  onClick: () => void;
  type?: 'button' | 'submit' | 'reset' | undefined;
  content: string | ReactNode;
};

export const Button: FC<ButtonProps> = ({
  onClick,
  type = 'button',
  content,
}) => {
  return (
    <button className={BTN_CLASS} type={type} onClick={onClick}>
      {content}
    </button>
  );
};
