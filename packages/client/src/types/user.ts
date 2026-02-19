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
