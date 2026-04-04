import { Model, DataType } from 'sequelize-typescript';
import type { ModelAttributes } from 'sequelize';

export interface ITopic {
  id: number
  title: string

  updatedAt?: Date
  createdAt?: Date
  deletedAt?: Date
}

export const TopicModelName = 'Topic';
export const TopicTableName = 'topics';

export const TopicAttributes: ModelAttributes<Model, ITopic> = {
  id: {
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  },
  createdAt: {
    type: DataType.DATE,
    allowNull: false,
  },
  updatedAt: {
    type: DataType.DATE,
    allowNull: false,
  },
  deletedAt: {
    type: DataType.DATE,
    allowNull: false,
  },
};

export class Topic extends Model<ITopic> implements ITopic {
  declare id: number;
  declare title: string;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt: Date;
}

export const TopicOptions = {
  tableName: TopicTableName,
  modelName: TopicModelName,
  timestamps: true,
};
