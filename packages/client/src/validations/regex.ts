export const REGEX: Record<string, RegExp> = {
  login: /^(?=.*[a-zA-Z])[a-zA-Z0-9_-]{3,20}$/,
  name: /^[A-ZА-ЯЁ][a-zA-Zа-яА-ЯёЁ-]*$/,
  psw: /^(?=.*[A-Z])(?=.*[0-9]).{8,40}$/,
  email: /^[a-zA-Z0-9_-]+@[a-zA-Z]+\.[a-zA-Z]{2,}$/,
  phone: /^\+?[0-9]{10,15}$/,
};
