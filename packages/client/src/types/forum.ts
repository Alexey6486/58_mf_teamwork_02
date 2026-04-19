import { type IServerUser } from './user';

export interface ITopic {
  id: number;
  title: string;
  text: string;
  authorId: string;
  createdAt: string;
  commentCount: number;
  User: IServerUser;
}

export interface ITopicComment {
  id: number;
  topicId: number;
  authorId: number;
  text: string;
  replyToCommentId: number | null;
  repliedToComment: ITopicComment | null;
  createdAt: string;
  updatedAt: string;
  User: IServerUser;
  Reactions: [];
}

export interface ITopicDetails {
  id: number;
  title: string;
  text: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  User: IServerUser;
  comments: ITopicComment[];
}
