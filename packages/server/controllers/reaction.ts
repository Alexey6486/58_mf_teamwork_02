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
import { TextValidation } from '../utils/validation';
import { escapeHTML } from '../utils/xss';
import { REACTIONS } from '../constants/constrains';

export const createReaction = catchAsync(async (request: Request, response: Response) => {
  const { topicId, commentId, authorId, text } = request.body;

  const targetTopic = await Topic.findByPk(topicId);
  const targetComment = await Comment.findByPk(commentId);

  if (!targetTopic || !targetComment) {
    throw new Error('Topic or comment not found');
  }

  if (TextValidation(text) && REACTIONS.includes(text)) {
    // Создаем ответ
    const reaction = await Reaction.create({
      topicId,
      commentId,
      authorId,
      text: escapeHTML(text),
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
  } else {
    response
      .set(postHeaders)
      .status(400)
      .json({
        error: 'wrong data type',
      });
  }
});
