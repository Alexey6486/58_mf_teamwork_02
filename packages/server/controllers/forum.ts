import type { Response, Request } from 'express';
import { Op, Sequelize } from 'sequelize';
import { Comment, Topic, User } from '../db';
import { catchAsync } from '../utils/catchAsync';
import { TextValidation } from '../utils/validation';
import { escapeHTML } from '../utils/xss';
import { CommentAssociationAlias } from '../models/comment';

type AuthRequest = Request & {
  user?: {
    id?: number;
  };
};

export const getAllTopics = catchAsync(
  async (request: Request, response: Response) => {
    const { page = 1, size = 10, search = '' } = request.query;

    const pageNum = Math.max(1, Number(page) || 1);
    const sizeNum = Math.max(1, Number(size) || 10);

    const whereCondition = search
      ? {
          title: { [Op.iLike]: `%${search}%` }, // поиск без учёта регистра
        }
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

    response //.set(getHeaders) не нужны, т.к. установлены глобально в index.ts app.use(cors...
      .status(200)
      .json({
        status: 'success',
        total: topics.length,
        pages: Math.ceil(total / sizeNum),
        hasNext: pageNum * sizeNum < total,
        hasPrev: pageNum > 1,
        data: {
          topics,
        },
      });
  }
);

export const createTopic = catchAsync(
  async (request: Request, response: Response) => {
    const { title, text, authorId } = request.body;
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

    if (TextValidation(title) && TextValidation(text)) {
      const topic = await Topic.create({
        title: escapeHTML(title),
        text: escapeHTML(text),
        authorId: user?.dataValues?.id,
      });

      response.status(200).json({
        status: 'success',
        data: {
          topic,
        },
      });
    } else {
      response.status(400).json({
        error: 'wrong data type',
      });
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
