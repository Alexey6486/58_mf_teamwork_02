import { DataType } from 'sequelize-typescript';
import type { Model } from 'sequelize-typescript';
import type { ModelAttributes } from 'sequelize';
import {
  MAX_TEXT,
  MAX_TITLE,
  MIN_TEXT,
  MIN_TITLE,
} from '../constants/constrains';
import { UserTableName } from './user';

export interface ITopic {
  id: number;
  title: string;
  text: string;
  authorId: string;

  updatedAt?: Date;
  createdAt?: Date;
}

export const TopicModelName = 'Topic';
export const TopicTableName = 'topics';
export const TopicAssociationAlias = 'topics';

export const TopicAttributes: ModelAttributes<Model, ITopic> = {
  id: {
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  authorId: {
    type: DataType.INTEGER,
    allowNull: false,
    references: {
      model: UserTableName,
      key: 'id',
    },
  },
  title: {
    type: DataType.STRING(100),
    unique: true,
    allowNull: false,
    validate: {
      // https://sequelize.org/docs/v6/core-concepts/validations-and-constraints/
      max: MAX_TITLE,
      min: MIN_TITLE,
    },
  },
  text: {
    type: DataType.STRING(1000),
    allowNull: false,
    validate: {
      max: MAX_TEXT,
      min: MIN_TEXT,
    },
  },
};

export const TopicOptions = {
  tableName: TopicTableName,
  modelName: TopicModelName,
  timestamps: true,
  paranoid: false,
};
