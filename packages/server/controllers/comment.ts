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

export const getAllComments = catchAsync(async (request: Request, response: Response) => {
  const { issueId } = request.params;

  const comments = await Topic.findByPk(
    issueId,
    {
      include: [
        { model: Comment, as: 'comments' },
      ],
    });

  console.log('comments', { comments: comments?.dataValues?.comments[0]?.dataValues });
  // comments: {
  //   dataValues: {
  //     id: 1,
  //     authorId: 1,
  //     title: 'Тема форума №1',
  //     text: 'Текст темы форума №1',
  //     createdAt: 2026-04-05T13:46:45.349Z,
  //     updatedAt: 2026-04-05T13:46:45.349Z,
  //     comments: [
  //       {
  //         dataValues: {
  //           id: 1,
  //           authorId: 1,
  //           topicId: 1,
  //           text: 'Комментарий №1 к теме форума №1',
  //           replyToCommentId: null,
  //           createdAt: 2026-04-05T13:53:19.234Z,
  //           updatedAt: 2026-04-05T13:53:19.234Z,
  //         },
  //       },
  //     ],
  //   },
  // }

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
  const topic = await Topic.findByPk(topicId);

  if (!topic) {
    throw new Error(`Topic with id ${topicId} not found`);
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
