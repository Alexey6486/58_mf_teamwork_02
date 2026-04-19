import { type FC } from 'react';
import { EIconButton } from '../enums';

type EnumIconType = typeof EIconButton[keyof typeof EIconButton];

type ButtonProps = {
  iconName: EnumIconType;
  hoverName: string;
  width?: string;
  type?: 'button' | 'submit' | 'reset' | undefined;
  styles?: string;
  onClick: () => void;
};

export const IB_HOVER = 'group';

const getIcon = (type: EnumIconType, hoverName: string, width: string) => {
  switch (type) {
    case EIconButton.BACK: {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={width}
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
          width={width}
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
          width={width}
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
          width={width}
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
    case EIconButton.FS_ON: {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={width}
          height="24"
          viewBox="0 0 24 24">
          <title>{hoverName}</title>
          <path
            fill="#FFFFFF"
            fillRule="evenodd"
            d="M12 4h6.586l-5.293 5.293l1.414 1.414L20 5.414V12h2V2H12zM4 18.586l5.293-5.293l1.414 1.414L5.414 20H12v2H2V12h2z"
            clipRule="evenodd"
          />
        </svg>
      );
    }
    case EIconButton.FS_OFF: {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={width}
          height="24"
          viewBox="0 0 24 24">
          <title>{hoverName}</title>
          <path
            fill="#FFFFFF"
            fillRule="evenodd"
            d="m16.414 9l6.793-6.793L21.793.793L15 7.586V1h-2v10h10V9zM9 16.414V23h2V13H1v2h6.586L.793 21.793l1.414 1.414z"
            clipRule="evenodd"
          />
        </svg>
      );
    }
    case EIconButton.THUMB_UP: {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={width}
          height="24"
          viewBox="0 0 24 24">
          <title>{hoverName}</title>
          <path
            className={`fill-path-light dark:fill-path-dark group-hover:fill-path-blue`}
            d="m20.975 12.185l-.739-.128zm-.705 4.08l-.74-.128zM6.938 20.477l-.747.065zm-.812-9.393l.747-.064zm7.869-5.863l.74.122zm-.663 4.045l.74.121zm-6.634.411l-.49-.568zm1.439-1.24l.49.569zm2.381-3.653l-.726-.189zm.476-1.834l.726.188zm1.674-.886l-.23.714zm.145.047l.229-.714zM9.862 6.463l.662.353zm4.043-3.215l-.726.188zm-2.23-1.116l-.326-.675zM3.971 21.471l-.748.064zM3 10.234l.747-.064a.75.75 0 0 0-1.497.064zm17.236 1.823l-.705 4.08l1.478.256l.705-4.08zm-6.991 9.193H8.596v1.5h4.649zm-5.56-.837l-.812-9.393l-1.495.129l.813 9.393zm11.846-4.276c-.507 2.93-3.15 5.113-6.286 5.113v1.5c3.826 0 7.126-2.669 7.764-6.357zM13.255 5.1l-.663 4.045l1.48.242l.663-4.044zm-6.067 5.146l1.438-1.24l-.979-1.136L6.21 9.11zm4.056-5.274l.476-1.834l-1.452-.376l-.476 1.833zm1.194-2.194l.145.047l.459-1.428l-.145-.047zm-1.915 4.038a8.4 8.4 0 0 0 .721-1.844l-1.452-.377A7 7 0 0 1 9.2 6.11zm2.06-3.991a.89.89 0 0 1 .596.61l1.452-.376a2.38 2.38 0 0 0-1.589-1.662zm-.863.313a.52.52 0 0 1 .28-.33l-.651-1.351c-.532.256-.932.73-1.081 1.305zm.28-.33a.6.6 0 0 1 .438-.03l.459-1.428a2.1 2.1 0 0 0-1.548.107zm2.154 8.176h5.18v-1.5h-5.18zM4.719 21.406L3.747 10.17l-1.494.129l.971 11.236zm-.969.107V10.234h-1.5v11.279zm-.526.022a.263.263 0 0 1 .263-.285v1.5c.726 0 1.294-.622 1.232-1.344zM14.735 5.343a5.5 5.5 0 0 0-.104-2.284l-1.452.377a4 4 0 0 1 .076 1.664zM8.596 21.25a.916.916 0 0 1-.911-.837l-1.494.129a2.416 2.416 0 0 0 2.405 2.208zm.03-12.244c.68-.586 1.413-1.283 1.898-2.19L9.2 6.109c-.346.649-.897 1.196-1.553 1.76zm13.088 3.307a2.416 2.416 0 0 0-2.38-2.829v1.5c.567 0 1 .512.902 1.073zM3.487 21.25c.146 0 .263.118.263.263h-1.5c0 .682.553 1.237 1.237 1.237zm9.105-12.105a1.583 1.583 0 0 0 1.562 1.84v-1.5a.083.083 0 0 1-.082-.098zm-5.72 1.875a.92.92 0 0 1 .316-.774l-.98-1.137a2.42 2.42 0 0 0-.83 2.04z"
          />
        </svg>
      );
    }
    case EIconButton.THUMB_DOWN: {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={width}
          height="24"
          viewBox="0 0 24 24">
          <title>{hoverName}</title>
          <path
            className={`fill-path-light dark:fill-path-dark group-hover:fill-path-blue`}
            d="m20.975 11.815l-.739.128zm-.705-4.08l-.74.128zM6.938 3.523l-.747-.065zm-.812 9.393l.747.064zm7.869 5.863l.74-.122zm-.663-4.045l.74-.121zm-6.634-.412l-.49.569zm1.439 1.24l.49-.568zm2.381 3.654l-.726.189zm.476 1.834l.726-.188zm1.674.886l-.23-.714zm.145-.047l.229.714zm-2.951-4.352l.662-.353zm4.043 3.216l-.726-.189zm-2.23 1.115l-.326.675zM3.971 2.529l-.748-.064zM3 13.766l.747.064a.75.75 0 0 1-1.497-.064zm17.236-1.823l-.705-4.08l1.478-.256l.705 4.08zM13.245 2.75H8.596v-1.5h4.649zm-5.56.838l-.812 9.392l-1.495-.129l.813-9.393zm11.846 4.275c-.507-2.93-3.15-5.113-6.286-5.113v-1.5c3.826 0 7.126 2.669 7.764 6.357zM13.255 18.9l-.663-4.045l1.48-.242l.663 4.044zm-6.067-5.146l1.438 1.24l-.979 1.137l-1.438-1.24zm4.056 5.274l.476 1.834l-1.452.376l-.476-1.833zm1.194 2.194l.145-.047l.459 1.428l-.145.047zm-1.915-4.038c.312.584.555 1.203.721 1.844l-1.452.377A7 7 0 0 0 9.2 17.89zm2.06 3.991a.89.89 0 0 0 .596-.61l1.452.376a2.38 2.38 0 0 1-1.589 1.662zm-.863-.313a.51.51 0 0 0 .28.33l-.651 1.351a2.01 2.01 0 0 1-1.081-1.305zm.28.33a.6.6 0 0 0 .438.03l.459 1.428a2.1 2.1 0 0 1-1.548-.107zm2.154-8.176h5.18v1.5h-5.18zM4.719 2.594L3.747 13.83l-1.494-.129l.971-11.236zm-.969-.107v11.279h-1.5V2.487zm-.526-.022a.263.263 0 0 0 .263.285v-1.5c.726 0 1.294.622 1.232 1.344zm11.511 16.192c.125.76.09 1.538-.104 2.284l-1.452-.377c.14-.543.167-1.11.076-1.664zM8.596 2.75a.916.916 0 0 0-.911.838l-1.494-.13A2.416 2.416 0 0 1 8.596 1.25zm.03 12.244c.68.586 1.413 1.283 1.898 2.19l-1.324.707c-.346-.649-.897-1.196-1.553-1.76zm13.088-3.307a2.416 2.416 0 0 1-2.38 2.829v-1.5a.916.916 0 0 0 .902-1.073zM3.487 2.75a.263.263 0 0 0 .263-.263h-1.5c0-.682.553-1.237 1.237-1.237zm9.105 12.105a1.583 1.583 0 0 1 1.562-1.84v1.5c-.05 0-.09.046-.082.098zm-5.72-1.875a.92.92 0 0 0 .316.774l-.98 1.137a2.42 2.42 0 0 1-.83-2.04z"
          />
        </svg>
      );
    }
    case EIconButton.SEND: {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={width}
          height="24"
          viewBox="0 0 24 24">
          <title>{hoverName}</title>
          <g
            fill="none"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="1.5">
            <path
              strokeLinecap="round"
              d="M22 12.5c0-.491-.005-1.483-.016-1.976c-.065-3.065-.098-4.598-1.229-5.733c-1.131-1.136-2.705-1.175-5.854-1.254a115 115 0 0 0-5.802 0c-3.149.079-4.723.118-5.854 1.254c-1.131 1.135-1.164 2.668-1.23 5.733a69 69 0 0 0 0 2.952c.066 3.065.099 4.598 1.23 5.733c1.131 1.136 2.705 1.175 5.854 1.254q1.204.03 2.401.036"
            />
            <path d="m2 6l6.913 3.925c2.526 1.433 3.648 1.433 6.174 0L22 6" />
            <path
              strokeLinecap="round"
              d="M22 17.5h-8m8 0c0-.7-1.994-2.008-2.5-2.5m2.5 2.5c0 .7-1.994 2.009-2.5 2.5"
            />
          </g>
        </svg>
      );
    }
    case EIconButton.CROSS: {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24">
          <title>{hoverName}</title>
          <path
            className="fill-path-light dark:fill-path-dark"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m7 7l10 10M7 17L17 7"
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
  width = '24',
}) => {
  return (
    <button className={`group ${styles}`} type={type} onClick={onClick}>
      {getIcon(iconName, hoverName, width)}
    </button>
  );
};
