import type { Response, Request } from 'express';
import {
  Comment,
  Topic,
  Reaction,
} from '../db';
import { catchAsync } from '../utils/catchAsync';
import {
  postHeaders
} from './headers/headers';

export const createReaction = catchAsync(async (request: Request, response: Response) => {
  const { topicId, commentId, authorId, text } = request.body;

  const targetTopic = await Topic.findByPk(topicId);
  const targetComment = await Comment.findByPk(commentId);

  if (!targetTopic || !targetComment) {
    throw new Error('Topic or comment not found');
  }

  // Создаем ответ
  const reaction = await Reaction.create({
    topicId,
    commentId,
    authorId,
    text,
  });

  response
    .set(postHeaders)
    .status(200)
    .json({
      status: 'success',
      data: {
        reaction,
      },
    });
});
