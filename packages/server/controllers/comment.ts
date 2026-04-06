import type { Response, Request } from 'express';
import {
  Comment,
  Topic
} from '../db';
import { catchAsync } from '../utils/catchAsync';
import {
  getHeaders,
  postHeaders
} from './headers/headers';
import { CommentAssociationAlias } from '../models/comment';

export const getAllComments = catchAsync(async (request: Request, response: Response) => {
  const { issueId } = request.params;

  // комментарии к топику и ответы на эти комментарии это одна и таже модель, хранятся они в одной таблице,
  // ответ на комментарий и сам комментарий ссылаются на один и тотже топик
  // поэтому при данной выборке мы должны получить топик по id, его комментарии и ответы к ним
  // на фронте можно сортировать комментарии по дате добавления и для тех комментарие, что являются ответами
  // можно добавлять превью комментария на который отвечают, как это обычно делается в чатах и форумах
  const comments = await Topic.findByPk(
    issueId,
    {
      include: [
        { model: Comment, as: CommentAssociationAlias },
      ]
    });

  response
    .set(getHeaders)
    .status(200)
    .json({
      status: 'success',
      data: {
        comments,
      },
    });
});

export const createComment = catchAsync(async (request: Request, response: Response) => {
  const { topicId, authorId, text, replyToCommentId = null } = request.body;

  // Проверяем существование topic
  const targetTopic = await Topic.findByPk(topicId);

  if (!targetTopic) {
    throw new Error('Topic  not found');
  }

  // Создаем комментарий
  const comment = await Comment.create({
    authorId,
    topicId,
    text,
    replyToCommentId: replyToCommentId || null
  });

  response
    .set(postHeaders)
    .status(200)
    .json({
      status: 'success',
      data: {
        comment,
      },
    });
});

export const createReply = catchAsync(async (request: Request, response: Response) => {
  const { topicId, authorId, text, replyToCommentId } = request.body;

  const targetTopic = await Topic.findByPk(topicId);
  const targetComment = await Comment.findByPk(replyToCommentId);

  if (!targetTopic || !targetComment) {
    throw new Error('Topic or comment not found');
  }

  // Создаем ответ
  const comment = await Comment.create({
    authorId,
    topicId,
    text,
    replyToCommentId,
  });

  response
    .set(postHeaders)
    .status(200)
    .json({
      status: 'success',
      data: {
        comment,
      },
    });
});
