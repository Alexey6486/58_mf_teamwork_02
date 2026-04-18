import type { Response, Request } from 'express';
import { Op } from 'sequelize';
import { Topic } from '../db';
import { catchAsync } from '../utils/catchAsync';
import { TextValidation } from '../utils/validation';
import { escapeHTML } from '../utils/xss';

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
      where: whereCondition,
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

    if (!resolvedAuthorId) {
      response.status(401).json({ error: 'unauthorized' });
      return;
    }

    if (TextValidation(title) && TextValidation(text)) {
      const topic = await Topic.create({
        title: escapeHTML(title),
        text: escapeHTML(text),
        authorId: resolvedAuthorId,
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
