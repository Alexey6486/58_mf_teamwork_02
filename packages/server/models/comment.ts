import { Model, DataType } from 'sequelize-typescript';
import type { ModelAttributes } from 'sequelize';
import { TopicTableName } from './topic';

export interface IComment {
  id: number
  topicId: number
  authorId: number
  text: string

  replyToCommentId: number

  updatedAt?: Date
  createdAt?: Date
}

export const CommentModelName = 'Comment';
export const CommentTableName = 'comments';

export const CommentAttributes: ModelAttributes<Model, IComment> = {
  id: {
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  authorId: {
    type: DataType.INTEGER,
    allowNull: false,
  },
  topicId: {
    type: DataType.INTEGER,
    allowNull: false,
    references: {
      model: TopicTableName,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  text: {
    type: DataType.STRING,
    allowNull: false,
  },
  replyToCommentId: {
    type: DataType.INTEGER,
    allowNull: true,
  },
};

export const CommentOptions = {
  tableName: CommentTableName,
  modelName: CommentModelName,
  timestamps: true,
  paranoid: false,
};
