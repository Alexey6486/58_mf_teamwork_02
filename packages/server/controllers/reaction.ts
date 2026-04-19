import type { Response, Request } from 'express';
import { Comment, Topic, Reaction, User } from '../db';
import { catchAsync } from '../utils/catchAsync';
import { TextValidation } from '../utils/validation';
import { escapeHTML } from '../utils/xss';
import { REACTIONS } from '../constants/constrains';

export const createReaction = catchAsync(
  async (request: Request, response: Response) => {
    const { topicId, commentId, authorId, text, id } = request.body;

    if (!id) {
      const targetTopic = await Topic.findByPk(topicId);
      const targetComment = await Comment.findByPk(commentId);

      if (!targetTopic || !targetComment) {
        throw new Error('Topic or comment not found');
      }

      const user = await User.findOne({
        where: {
          userId: authorId,
        },
      });

      if (TextValidation(text) && REACTIONS.includes(text)) {
        // Создаем ответ
        const reaction = await Reaction.create({
          topicId,
          commentId,
          authorId: user?.dataValues?.id,
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
    } else {
      const reaction = await Reaction.findByPk(id);

      if (reaction) {
        // Обновляем запись

        const [updated] = await Reaction.update(
          { text },
          {
            where: { id },
            returning: true,
            validate: true,
          }
        );

        response.status(200).json({
          status: 'success',
          data: {
            reaction: updated,
          },
        });
      } else {
        response.status(400).json({
          error: 'wrong id',
        });
      }
    }
  }
);

export const deleteReaction = catchAsync(
  async (request: Request, response: Response) => {
    const { id } = request.body;

    const result = await Reaction.destroy({ where: { id } });

    if (result === 1) {
      response.status(200).json({
        status: 'success',
      });
    } else {
      response.status(404).json({
        error: 'reaction not found',
      });
    }
  }
);
