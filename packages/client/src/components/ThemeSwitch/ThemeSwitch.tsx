import { type FC } from 'react';
import { ETheme } from '../../enums';
import { IconButton } from '../IconButton';
import { useTheme } from '../../hooks/useTheme';

export const ThemeSwitch: FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="absolute top-6 left-6 z-10">
      {theme === ETheme.light && (
        <IconButton
          iconName={ETheme.light}
          hoverName="Переключить на тёмную тему"
          onClick={setTheme(ETheme.dark)}
        />
      )}
      {theme === ETheme.dark && (
        <IconButton
          iconName={ETheme.dark}
          hoverName="Переключить на светлую тему"
          onClick={setTheme(ETheme.light)}
        />
      )}
    </div>
  );
};
