import type { Response, Request } from 'express';
import { Op, Sequelize } from 'sequelize';
import { Comment, Topic, User } from '../db';
import { catchAsync } from '../utils/catchAsync';
import { TextValidation } from '../utils/validation';
import { escapeHTML } from '../utils/xss';
import { CommentAssociationAlias } from '../models/comment';

const toPositiveInt = (value: unknown, fallback: number): number => {
  const num = Number(value);
  return Number.isFinite(num) && num > 0 ? Math.floor(num) : fallback;
};

const toSearchString = (value: unknown): string => {
  return typeof value === 'string' ? value.trim() : '';
};

export const getAllTopics = catchAsync(
  async (request: Request, response: Response) => {
    const pageNum = toPositiveInt(request.query.page, 1);
    const sizeNum = toPositiveInt(request.query.size, 10);
    const search = toSearchString(request.query.search);

    const whereCondition = search
      ? { title: { [Op.iLike]: `%${search}%` } }
      : {};

    const topics = await Topic.findAll({
      limit: sizeNum,
      offset: (pageNum - 1) * sizeNum,
      order: [['createdAt', 'DESC']],
      group: ['Topic.id', 'User.id'],
      include: [
        {
          model: Comment,
          as: CommentAssociationAlias,
          attributes: [], // Don't fetch comment details
          required: false, // LEFT JOIN - включаем темы без комментариев
        },
        {
          model: User,
          attributes: ['id', 'userId', 'login'],
        },
      ],
      attributes: [
        'id',
        'title',
        'text',
        'authorId',
        'createdAt',
        [
          Sequelize.fn('COUNT', Sequelize.col(`${CommentAssociationAlias}.id`)),
          'commentCount',
        ],
      ],
      where: whereCondition,
      subQuery: false,
    });

    const total = await Topic.count({ where: whereCondition });

    response.status(200).json({
      status: 'success',
      total,
      pages: Math.ceil(total / sizeNum),
      hasNext: pageNum * sizeNum < total,
      hasPrev: pageNum > 1,
      data: { topics },
    });
  }
);

export const createTopic = catchAsync(
  async (request: Request, response: Response) => {
    const { title, text, authorId } = request.body as {
      title?: unknown;
      text?: unknown;
      authorId?: unknown;
    };

    const user = await User.findOne({
      where: {
        userId: authorId,
      },
    });

    const normalizedTitle = typeof title === 'string' ? title.trim() : '';
    const normalizedText = typeof text === 'string' ? text.trim() : '';

    if (TextValidation(normalizedTitle) && TextValidation(normalizedText)) {
      const topic = await Topic.create({
        title: escapeHTML(normalizedTitle),
        text: escapeHTML(normalizedText),
        authorId: user?.dataValues?.id,
      });

      response.status(200).json({
        status: 'success',
        data: { topic },
      });
    } else {
      response.status(400).json({ error: 'wrong data type' });
    }
  }
);

export const deleteTopic = catchAsync(
  async (request: Request, response: Response) => {
    const { id } = request.body;

    const result = await Topic.destroy({ where: { id } });

    if (result === 1) {
      response.status(200).json({
        status: 'success',
      });
    } else {
      response.status(404).json({
        error: 'topic not found',
      });
    }
  }
);
