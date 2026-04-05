import type { Response, Request } from 'express';
import { Op } from 'sequelize';
import { Topic } from '../db';
import { catchAsync } from '../utils/catchAsync';
import {
  getHeaders,
  postHeaders
} from './headers/headers'

export const getAllTopics = catchAsync(async (request: Request, response: Response) => {
  console.log('request query', { rq: request.query });
  const { page = 1, size = 10, search = '' } = request.query;

  const whereCondition = search
    ? {
      title: { [Op.iLike]: `%${search}%` } // поиск без учёта регистра
    }
    : {};
  console.log('whereCondition', { whereCondition });

  const limit = Number(size);
  const offset = Number(page);
  const topics = await Topic.findAll({
    limit: limit > 0 ? limit : 10,
    offset: (offset > 0 ? offset - 1 : 1) * limit,
    order: [['createdAt', 'ASC']],
    where: whereCondition,
  });
  console.log('db search topics', { topics });

  const total = await Topic.count({ where: whereCondition });
  console.log('db search total', { total });

  response
    .set(getHeaders)
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
});

export const createTopics = catchAsync(async (request: Request, response: Response) => {
  console.log('request body', { body: request.body });
  const { title, text, authorId } = request.body;

  const topic = await Topic.create({ title, text, authorId });
  console.log('db result', { topic });

  response
    .set(postHeaders)
    .status(200)
    .json({
      status: 'success',
      data: {
        topic,
      },
    });
});
