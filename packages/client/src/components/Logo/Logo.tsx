import React, { type FC } from 'react';
import { TITLE_CLASS } from '../../constants/style-groups';
import { type EnumIconType, IconButton } from '../IconButton';

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
};

export const Logo: FC<TProps> = ({
  text = 'FLIP7',
  bgColor = 'bg-f7-salad',
  textSize = 'text-5xl',
  fontWeight = 'font-semibold',
  leftBtnCb,
  leftBtnIcon,
  leftBtnText,
  rightBtnCb,
  rightBtnIcon,
  rightBtnText,
}) => {
  return (
    <div className={`${TITLE_CLASS} ${bgColor}`}>
      {leftBtnCb && leftBtnIcon && leftBtnText && (
        <div className="flex justify-between absolute pl-8 pr-8 top-1/2 -translate-y-1/2 left-0 z-20">
          <IconButton
            onClick={leftBtnCb}
            iconName={leftBtnIcon}
            hoverName={leftBtnText}
          />
        </div>
      )}
      <h3
        className={`${textSize} ${fontWeight} h-full flex justify-center items-center w-[calc(100%-20px)] border-l border-r border-f7-yellow`}>
        {text}
      </h3>
      {rightBtnCb && rightBtnIcon && rightBtnText && (
        <div className="flex justify-between absolute pl-8 pr-8 top-1/2 -translate-y-1/2 right-0 z-20">
          <IconButton
            onClick={rightBtnCb}
            iconName={rightBtnIcon}
            hoverName={rightBtnText}
          />
        </div>
      )}
    </div>
  );
};
