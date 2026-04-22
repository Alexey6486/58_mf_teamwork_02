export enum ETheme {
  light = 'light',
  dark = 'dark',
}

export enum EReactions {
  TU = 'thumb_up',
  TD = 'thumb_down',
}

export const EIconButton = {
  BACK: 'back',
  OUT: 'out',
  THEME_LIGHT: ETheme.light,
  THEME_DARK: ETheme.dark,
  FS_ON: 'fs_on',
  FS_OFF: 'fs_off',
  THUMB_UP: EReactions.TU,
  THUMB_DOWN: EReactions.TD,
  SEND: 'send',
  CROSS: 'cross',
} as const;
