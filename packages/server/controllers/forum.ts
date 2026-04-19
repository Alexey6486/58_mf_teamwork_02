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

const toPositiveInt = (value: unknown, fallback: number): number => {
  const num = Number(value);
  return Number.isFinite(num) && num > 0 ? Math.floor(num) : fallback;
};

const toOptionalInt = (value: unknown): number | undefined => {
  const num = Number(value);
  return Number.isFinite(num) ? Math.floor(num) : undefined;
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
      where: whereCondition,
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

    const authAuthorId = toOptionalInt((request as AuthRequest).user?.id);
    const bodyAuthorId = toOptionalInt(authorId);
    const resolvedAuthorId = authAuthorId ?? bodyAuthorId; // приоритет protect

    if (!resolvedAuthorId) {
      response.status(401).json({ error: 'unauthorized' });
      return;
    }

    const normalizedTitle = typeof title === 'string' ? title.trim() : '';
    const normalizedText = typeof text === 'string' ? text.trim() : '';

    if (TextValidation(normalizedTitle) && TextValidation(normalizedText)) {
      const topic = await Topic.create({
        title: escapeHTML(normalizedTitle),
        text: escapeHTML(normalizedText),
        authorId: resolvedAuthorId,
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
