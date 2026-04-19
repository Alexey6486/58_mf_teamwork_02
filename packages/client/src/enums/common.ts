export enum ETheme {
  light = 'light',
  dark = 'dark',
}

export const EIconButton = {
  BACK: 'back',
  OUT: 'out',
  THEME_LIGHT: ETheme.light,
  THEME_DARK: ETheme.dark,
  FS_ON: 'fs_on',
  FS_OFF: 'fs_off',
  THUMB_UP: 'thumb_up',
  THUMB_DOWN: 'thumb_down',
  SEND: 'send',
  CROSS: 'cross',
} as const;
