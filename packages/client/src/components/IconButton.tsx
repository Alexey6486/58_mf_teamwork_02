import { type FC } from 'react';
import { EIconButton } from '../enums';

type ButtonProps = {
  iconName: EIconButton;
  hoverName: string;
  type?: 'button' | 'submit' | 'reset' | undefined;
  styles?: string;
  onClick: () => void;
};

const getIcon = (type: EIconButton, hoverName: string) => {
  switch (type) {
    case EIconButton.BACK: {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24">
          <title>{hoverName}</title>
          <path
            className="fill-path-light dark:fill-path-dark"
            d="M21 11H6.414l5.293-5.293l-1.414-1.414L2.586 12l7.707 7.707l1.414-1.414L6.414 13H21z"
          />
        </svg>
      );
    }
    case EIconButton.OUT: {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24">
          <title>{hoverName}</title>
          <path
            className="fill-path-light dark:fill-path-dark"
            d="m13 16l5-4l-5-4v3H4v2h9z"
          />
          <path
            className="fill-path-light dark:fill-path-dark"
            d="M20 3h-9c-1.103 0-2 .897-2 2v4h2V5h9v14h-9v-4H9v4c0 1.103.897 2 2 2h9c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2"
          />
        </svg>
      );
    }
    default: {
      return <></>;
    }
  }
};

export const IconButton: FC<ButtonProps> = ({
  onClick,
  type = 'button',
  styles,
  iconName,
  hoverName,
}) => {
  return (
    <button className={styles} type={type} onClick={onClick}>
      {getIcon(iconName, hoverName)}
    </button>
  );
};
