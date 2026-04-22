import React, { type FC, type ReactNode } from 'react';
import { ThemeSwitch } from '../ThemeSwitch';
import { MAIN_CONTAINER_CLASS } from '../../constants/style-groups';

type TProps = {
  children?: ReactNode;
};

export const Layout: FC<TProps> = ({ children }) => {
  return (
    <div className={MAIN_CONTAINER_CLASS}>
      {children}
      <ThemeSwitch />
    </div>
  );
};
