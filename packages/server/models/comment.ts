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
export const CommentAssociationAlias = 'comments';

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
      model: TopicTableName, // несмотря на то, что поле называется модель, указывать нужно название таблицы
      key: 'id',
    },
    onDelete: 'CASCADE', // при удалении топика, комментарий связанный с ним будет удален
  },
  text: {
    type: DataType.STRING,
    allowNull: false,
  },
  replyToCommentId: {
    type: DataType.INTEGER,
    allowNull: true,
    references: {
      model: CommentTableName,
      key: 'id',
    },
    onDelete: 'CASCADE', // при удалении комментария, комментарий-ответ связанный с ним будет удален
  },
};

export const CommentOptions = {
  tableName: CommentTableName,
  modelName: CommentModelName,
  timestamps: true,
  paranoid: false,
};
