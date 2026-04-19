import type { Response, Request } from 'express';
import { Comment, Reaction, Topic, User } from '../db';
import { catchAsync } from '../utils/catchAsync';
import { CommentAssociationAlias } from '../models/comment';
import { TextValidation } from '../utils/validation';
import { escapeHTML } from '../utils/xss';

type AuthRequest = Request & {
  user?: {
    id?: number;
  };
};

export const getAllComments = catchAsync(
  async (request: Request, response: Response) => {
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
    const topic = await Topic.findByPk(topicId, {
      include: [
        {
          model: User,
          attributes: ['id', 'userId', 'login'],
        },
        {
          model: Comment,
          required: false, // LEFT JOIN - пост без комментариев тоже вернется
          separate: true, // отдельный запрос для комментариев (лучше для производительности)
          as: CommentAssociationAlias,
          order: [['createdAt', 'ASC']],
          include: [
            {
              model: User,
              attributes: ['id', 'userId', 'login'],
            },
            {
              model: Reaction,
              attributes: ['id', 'text', 'authorId', 'topicId', 'commentId'],
            },
            {
              model: Comment,
              attributes: ['id', 'text', 'authorId', 'createdAt'],
              as: 'repliedToComment',
              include: [
                {
                  model: User,
                  attributes: ['id', 'userId', 'login'],
                },
              ],
            },
          ],
        },
      ],
    });

    response.status(200).json({
      status: 'success',
      data: {
        topic,
      },
    });
  }
);

export const createComment = catchAsync(
  async (request: Request, response: Response) => {
    const topicId = Number(request.params.topicId ?? request.body.topicId);
    const { authorId, text, replyToCommentId = null } = request.body;
    const authAuthorId = (request as AuthRequest).user?.id;
    const resolvedAuthorId = authorId ?? authAuthorId;

    const user = await User.findOne({
      where: {
        userId: resolvedAuthorId,
      },
    });

    if (!resolvedAuthorId) {
      response.status(401).json({ error: 'unauthorized' });
      return;
    }

    // Проверяем существование topic
    const targetTopic = await Topic.findByPk(topicId);

    if (!targetTopic) {
      throw new Error('Topic not found');
    }

    if (TextValidation(text)) {
      // Создаем комментарий
      const comment = await Comment.create({
        authorId: user?.dataValues?.id,
        topicId,
        text: escapeHTML(text),
        replyToCommentId: replyToCommentId || null,
      });

      response.status(200).json({
        status: 'success',
        data: {
          comment,
        },
      });
    } else {
      response.status(400).json({
        error: 'wrong data type',
      });
    }
  }
);

export const createReply = catchAsync(
  async (request: Request, response: Response) => {
    const topicId = Number(request.params.topicId ?? request.body.topicId);
    const { authorId, text, replyToCommentId } = request.body;
    const authAuthorId = (request as AuthRequest).user?.id;
    const resolvedAuthorId = authorId ?? authAuthorId;

    if (!resolvedAuthorId) {
      response.status(401).json({ error: 'unauthorized' });
      return;
    }

    const targetTopic = await Topic.findByPk(topicId);
    const targetComment = await Comment.findByPk(replyToCommentId);

    if (!targetTopic || !targetComment) {
      throw new Error('Topic or comment not found');
    }

    if (TextValidation(text)) {
      // Создаем ответ
      const comment = await Comment.create({
        authorId: resolvedAuthorId,
        topicId,
        text: escapeHTML(text),
        replyToCommentId,
      });

      response.status(200).json({
        status: 'success',
        data: {
          comment,
        },
      });
    } else {
      response.status(400).json({
        error: 'wrong data type',
      });
    }
  }
);
