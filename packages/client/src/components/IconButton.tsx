import { type FC } from 'react';
import { EIconButton } from '../enums';

type EnumIconType = typeof EIconButton[keyof typeof EIconButton];

type ButtonProps = {
  iconName: EnumIconType;
  hoverName: string;
  type?: 'button' | 'submit' | 'reset' | undefined;
  styles?: string;
  onClick: () => void;
};

const getIcon = (type: EnumIconType, hoverName: string) => {
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
    case EIconButton.THEME_LIGHT: {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24">
          <title>{hoverName}</title>
          <path
            fill="#000000"
            d="M11.289 23.287v-2.952a.713.713 0 1 1 1.426 0v2.952a.713.713 0 1 1-1.426 0m8.19-2.804l-2.087-2.086a.713.713 0 1 1 1.008-1.008l2.085 2.089a.713.713 0 0 1-1.009 1.002l.001.001zm-15.962 0a.71.71 0 0 1 0-1.008l2.087-2.087a.713.713 0 1 1 1.008 1.008l-2.087 2.086a.71.71 0 0 1-1.008 0zm2.803-8.485a5.683 5.683 0 1 1 11.366 0a5.683 5.683 0 0 1-11.366 0m1.425 0a4.26 4.26 0 1 0 8.518 0a4.26 4.26 0 0 0-8.518 0m12.591.713a.713.713 0 1 1 0-1.426h2.952a.713.713 0 1 1 0 1.426zm-19.623 0a.713.713 0 1 1 0-1.426h2.953a.713.713 0 1 1 0 1.426zM17.39 6.608a.71.71 0 0 1 0-1.008l2.087-2.087a.713.713 0 1 1 1.008 1.008l-2.087 2.087a.71.71 0 0 1-1.008 0m-11.788 0L3.517 4.523a.713.713 0 1 1 1.008-1.008l2.087 2.087A.713.713 0 1 1 5.604 6.61zm5.685-2.944V.713a.713.713 0 1 1 1.426 0v2.952a.713.713 0 1 1-1.426 0z"
          />
        </svg>
      );
    }
    case EIconButton.THEME_DARK: {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24">
          <title>{hoverName}</title>
          <path
            d="M12 11.807A9.002 9.002 0 0 1 10.049 2a9.942 9.942 0 0 0-5.12 2.735c-3.905 3.905-3.905 10.237 0 14.142c3.906 3.906 10.237 3.905 14.143 0a9.946 9.946 0 0 0 2.735-5.119A9.003 9.003 0 0 1 12 11.807z"
            fill="#FFFFFF"
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
