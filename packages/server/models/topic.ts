import { Model, DataType } from 'sequelize-typescript';
import type { ModelAttributes } from 'sequelize';

export interface ITopic {
  id: number
  title: string
  text: string
  authorId: string

  updatedAt?: Date
  createdAt?: Date
}

export const TopicModelName = 'Topic';
export const TopicTableName = 'topics';

export const TopicAttributes: ModelAttributes<Model, ITopic> = {
  id: {
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  authorId: {
    type: DataType.INTEGER,
    allowNull: false,
  },
  title: {
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  },
  text: {
    type: DataType.STRING,
    allowNull: false,
  },
};

export const TopicOptions = {
  tableName: TopicTableName,
  modelName: TopicModelName,
  timestamps: true,
  paranoid: false,
};
