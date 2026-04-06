import type { Response, Request } from 'express';
import {
  Comment,
  Reaction,
  Topic
} from '../db'
import { catchAsync } from '../utils/catchAsync';
import {
  getHeaders,
  postHeaders
} from './headers/headers';
import { CommentAssociationAlias } from '../models/comment';
import { ReactionAssociationAlias } from '../models/reaction';

export const getAllComments = catchAsync(async (request: Request, response: Response) => {
  const { topicId } = request.params;

  // комментарии к топику и ответы на эти комментарии это одна и таже модель, хранятся они в одной таблице,
  // ответ на комментарий и сам комментарий ссылаются на один и тотже топик
  // поэтому при данной выборке мы должны получить топик по id, его комментарии, ответы к ним и
  // все реакции комментариев, т.к. они тоже привязаны к топику, к которому прнадлежат комментарии
  // на фронте нужно будет делать маппинг
  // - отрисовать данные открытой темы форума (загловок, текст)
  // - отрисовать комментарии
  // - если комментарий это ответ, то перед текстом комментария сделать цитату из комментария, на который делается ответ
  // - к каждому комментарию добавить реакции, если они есть
  const comments = await Topic.findByPk(
    topicId,
    {
      include: [
        { model: Comment, as: CommentAssociationAlias, order: [['createdAt', 'ASC']] },
        { model: Reaction, as: ReactionAssociationAlias },
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
