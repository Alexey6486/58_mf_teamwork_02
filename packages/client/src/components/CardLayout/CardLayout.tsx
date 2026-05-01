import React, { type FC, type ReactNode } from 'react';
import {
  CARD_BORDER_CLASS,
  FORM_CONTAINER_CLASS,
} from '../../constants/style-groups';
import { Logo } from '../Logo/Logo';
import { type EnumIconType } from '../IconButton';

type TProps = {
  text?: string;
  bgColor?: string;
  textSize?: string;
  fontWeight?: string;
  leftBtnCb?: () => void;
  leftBtnIcon?: EnumIconType;
  leftBtnText?: string;
  rightBtnCb?: () => void;
  rightBtnIcon?: EnumIconType;
  rightBtnText?: string;
  children?: ReactNode;
};

export const CardLayout: FC<TProps> = ({
  children,
  text,
  bgColor,
  textSize,
  fontWeight,
  rightBtnCb,
  rightBtnIcon,
  rightBtnText,
  leftBtnText,
  leftBtnIcon,
  leftBtnCb,
}) => {
  return (
    <div className={FORM_CONTAINER_CLASS}>
      <span className={CARD_BORDER_CLASS} />
      <Logo
        text={text}
        textSize={textSize}
        bgColor={bgColor}
        fontWeight={fontWeight}
        leftBtnCb={leftBtnCb}
        leftBtnIcon={leftBtnIcon}
        leftBtnText={leftBtnText}
        rightBtnCb={rightBtnCb}
        rightBtnIcon={rightBtnIcon}
        rightBtnText={rightBtnText}
      />
      <div className="z-20 px-[20px] w-full">{children}</div>
    </div>
  );
};
