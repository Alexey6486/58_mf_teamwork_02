export enum ETheme {
  light = 'light',
  dark = 'dark',
}

export const EIconButton = {
  BACK: 'back',
  OUT: 'out',
  THEME_LIGHT: ETheme.light,
  THEME_DARK: ETheme.dark,
} as const;
