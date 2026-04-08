import type { Response, Request } from 'express';
import { Op } from 'sequelize';
import { Topic } from '../db';
import { catchAsync } from '../utils/catchAsync';
import { TextValidation } from '../utils/validation';
import { escapeHTML } from '../utils/xss';

export const getAllTopics = catchAsync(
  async (request: Request, response: Response) => {
    const { page = 1, size = 10, search = '' } = request.query;

    const whereCondition = search
      ? {
          title: { [Op.iLike]: `%${search}%` }, // поиск без учёта регистра
        }
      : {};

    const limit = Number(size);
    const offset = Number(page);
    const topics = await Topic.findAll({
      limit: limit > 0 ? limit : 10,
      offset: (offset > 0 ? offset - 1 : 1) * limit,
      order: [['createdAt', 'DESC']],
      where: whereCondition,
    });

    const total = await Topic.count({ where: whereCondition });

    response //.set(getHeaders) не нужны, т.к. установлены глобально в index.ts app.use(cors...
      .status(200)
      .json({
        status: 'success',
        total: topics.length,
        pages: Math.ceil(total / (size as number)),
        hasNext: (size as number) * (size as number) < total,
        hasPrev: page > 1,
        data: {
          topics,
        },
      });
  }
);

export const createTopic = catchAsync(
  async (request: Request, response: Response) => {
    const { title, text, authorId } = request.body;

    if (TextValidation(title) && TextValidation(text)) {
      const topic = await Topic.create({
        title: escapeHTML(title),
        text: escapeHTML(text),
        authorId,
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
