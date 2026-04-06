import { DataType } from 'sequelize-typescript';
import type { Model } from 'sequelize-typescript';
import type { ModelAttributes } from 'sequelize';
import { CommentTableName } from './comment';
import { TopicTableName } from './topic';
import { REACTIONS } from '../constants/constrains';

export interface IReaction {
  id: number;
  topicId: number;
  commentId: number;
  authorId: number;

  text: string;

  updatedAt?: Date;
  createdAt?: Date;
}

export const ReactionModelName = 'Reaction';
export const ReactionTableName = 'reactions';
export const ReactionAssociationAlias = 'reactions';

export const ReactionAttributes: ModelAttributes<Model, IReaction> = {
  id: {
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  authorId: {
    type: DataType.INTEGER,
    allowNull: false,
  },
  text: {
    type: DataType.STRING,
    allowNull: false,
    validate: {
      isIn: [REACTIONS],
    },
  },
  topicId: {
    type: DataType.INTEGER,
    allowNull: false,
    references: {
      model: TopicTableName,
      key: 'id',
    },
  },
  commentId: {
    type: DataType.INTEGER,
    allowNull: true,
    references: {
      model: CommentTableName,
      key: 'id',
    },
    onDelete: 'CASCADE', // при удалении комментария, комментарий-ответ связанный с ним будет удален
  },
};

export const ReactionOptions = {
  tableName: ReactionTableName,
  modelName: ReactionModelName,
  timestamps: true,
  paranoid: false,
};
