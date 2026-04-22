import { DataType } from 'sequelize-typescript';
import type { Model } from 'sequelize-typescript';
import type { ModelAttributes } from 'sequelize';

export enum TTheme {
  light = 'light',
  dark = 'dark',
}

export interface IUser {
  id: number;
  userId: number;
  theme: TTheme;
  login: string;
}

export const UserModelName = 'User';
export const UserTableName = 'users';
export const UserAssociationAlias = 'users';

export const UserAttributes: ModelAttributes<Model, IUser> = {
  id: {
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataType.INTEGER,
    allowNull: false,
    unique: true,
  },
  theme: {
    type: DataType.ENUM(TTheme.light, TTheme.dark),
    defaultValue: TTheme.light,
    allowNull: false,
  },
  login: {
    type: DataType.STRING,
    allowNull: false,
  },
};

export const UserOptions = {
  tableName: UserTableName,
  modelName: UserModelName,
  timestamps: true,
  paranoid: false,
};
