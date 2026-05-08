import type { Response, Request } from 'express';
import { Comment, Reaction, Topic, User } from '../db';
import { catchAsync } from '../utils/catchAsync';
import { CommentAssociationAlias } from '../models/comment';
import {
  TextValidation,
  normalizeText,
  toPositiveInt,
} from '../utils/validation';
import { escapeHTML } from '../utils/xss';

const COMMENT_TEXT_MIN = 1;
const COMMENT_TEXT_MAX = 2000;

const toOptionalPositiveInt = (value: unknown): number | null => {
  if (value === null || value === undefined || value === '') return null;
  return toPositiveInt(value) ?? null;
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
              include: [
                {
                  model: User,
                  attributes: ['id', 'userId', 'login'],
                },
              ],
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
    const topicId = toPositiveInt(
      request.params.topicId ?? request.body.topicId
    );
    const {
      authorId,
      text,
      replyToCommentId = null,
    } = request.body as {
      authorId?: unknown;
      text?: unknown;
      replyToCommentId?: unknown;
    };

    if (!topicId) {
      response.status(400).json({ error: 'wrong topic id' });
      return;
    }

    const authorExternalId = toPositiveInt(authorId);
    if (!authorExternalId) {
      response.status(400).json({ error: 'wrong author id' });
      return;
    }

    const user = await User.findOne({
      where: {
        userId: authorExternalId,
      },
    });

    if (!user) {
      response.status(400).json({ error: 'user not found' });
      return;
    }

    const normalizedText = normalizeText(text);
    const isTextValid = TextValidation(normalizedText, {
      min: COMMENT_TEXT_MIN,
      max: COMMENT_TEXT_MAX,
    });

    if (!isTextValid) {
      response.status(400).json({ error: 'wrong data type or length' });
      return;
    }

    const targetTopic = await Topic.findByPk(topicId);
    if (!targetTopic) {
      response.status(404).json({ error: 'topic not found' });
      return;
    }

    const normalizedReplyToCommentId = toOptionalPositiveInt(replyToCommentId);
    if (
      replyToCommentId !== null &&
      replyToCommentId !== undefined &&
      replyToCommentId !== '' &&
      !normalizedReplyToCommentId
    ) {
      response.status(400).json({ error: 'wrong replyToCommentId' });
      return;
    }

    if (normalizedReplyToCommentId) {
      const repliedComment = await Comment.findByPk(normalizedReplyToCommentId);

      if (!repliedComment || repliedComment.dataValues.topicId !== topicId) {
        response
          .status(400)
          .json({ error: 'reply comment not found in topic' });
        return;
      }
    }

    const comment = await Comment.create({
      authorId: user.dataValues.id,
      topicId,
      text: escapeHTML(normalizedText),
      replyToCommentId: normalizedReplyToCommentId,
    });

    response.status(200).json({
      status: 'success',
      data: { comment },
    });
  }
);
