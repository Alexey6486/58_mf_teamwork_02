import { type FC } from 'react';
import { ETheme } from '../../enums';
import { IconButton } from '../IconButton';
import { useTheme } from '../../hooks/useTheme';

export const ThemeSwitch: FC = () => {
  const { theme, setTheme } = useTheme();

  console.log('ThemeSwitch', { theme });

  return (
    <div className="absolute top-6 left-6 z-10">
      {theme === ETheme.light && (
        <IconButton
          iconName={ETheme.light}
          hoverName="switch to dark theme"
          onClick={setTheme(ETheme.dark)}
        />
      )}
      {theme === ETheme.dark && (
        <IconButton
          iconName={ETheme.dark}
          hoverName="switch to light theme"
          onClick={setTheme(ETheme.light)}
        />
      )}
    </div>
  );
};
