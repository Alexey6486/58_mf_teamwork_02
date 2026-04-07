import type { Response, Request } from 'express';
import { Comment, Topic, Reaction } from '../db';
import { catchAsync } from '../utils/catchAsync';
import { TextValidation } from '../utils/validation';
import { escapeHTML } from '../utils/xss';
import { REACTIONS } from '../constants/constrains';

export const createReaction = catchAsync(
  async (request: Request, response: Response) => {
    const { topicId, commentId, authorId, text } = request.body;

    const targetTopic = await Topic.findByPk(topicId);
    const targetComment = await Comment.findByPk(commentId);

    if (!targetTopic || !targetComment) {
      throw new Error('Topic or comment not found');
    }

    // TODO логику, если данный пользователь уже ставил реакцию и приходит
    //  новая реакция на тот же комментарий, то нужно его заменить,
    //  т.е. разрешать только одну реакцию на комментарий от одного пользователя
    if (TextValidation(text) && REACTIONS.includes(text)) {
      // Создаем ответ
      const reaction = await Reaction.create({
        topicId,
        commentId,
        authorId,
        text: escapeHTML(text),
      });

      response.status(200).json({
        status: 'success',
        data: {
          reaction,
        },
      });
    } else {
      response.status(400).json({
        error: 'wrong data type',
      });
    }
  }
);

// TODO сделать контроллер для удаления реакции, на фронте проверять,
//  если данный пользователь уже поставил реакцию под данных комментарием и
//  хочет её удалить, а не поменять на другую, то фронт отправляет запрос на
//  ручку удаления реакции
