import type { ETheme } from '../enums';

export interface IUser {
  id?: string;
  first_name: string;
  second_name: string;
  display_name: string;
  login: string;
  email: string;
  phone: string;
  avatar: string;
}

export interface IUserPassword {
  oldPassword: string;
  newPassword: string;
  confirmedPassword: string;
}

export interface IRegistrationForm extends IUser {
  newPassword: string;
  confirmedPassword: string;
}

export interface IRegistrationDto extends IUser {
  password: string;
}

export interface IServerUser {
  userId: string;
  login: string;
  theme?: ETheme;
  id?: string;
}

export interface IServerUserTheme {
  theme: ETheme;
}

export interface IServerUserThemeResponse {
  data: IServerUserTheme;
}
