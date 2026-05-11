import type { Response, Request } from 'express';
import { Op, Sequelize } from 'sequelize';
import { Comment, Topic, User } from '../db';
import { catchAsync } from '../utils/catchAsync';
import {
  TextValidation,
  normalizeText,
  sanitizeSearch,
  toPositiveInt,
} from '../utils/validation';
import { escapeHTML } from '../utils/xss';
import { CommentAssociationAlias } from '../models/comment';

const DEFAULT_PAGE = 1;
const DEFAULT_SIZE = 10;
const MAX_PAGE_SIZE = 50;
const MAX_SEARCH_LENGTH = 100;

const TOPIC_TITLE_MIN = 1;
const TOPIC_TITLE_MAX = 120;
const TOPIC_TEXT_MIN = 1;
const TOPIC_TEXT_MAX = 5000;

export const getAllTopics = catchAsync(
  async (request: Request, response: Response) => {
    const pageNum = toPositiveInt(request.query.page) ?? DEFAULT_PAGE;
    const rawSize = toPositiveInt(request.query.size) ?? DEFAULT_SIZE;
    const sizeNum = Math.min(rawSize, MAX_PAGE_SIZE);
    const search = sanitizeSearch(request.query.search, MAX_SEARCH_LENGTH);

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

    const normalizedTitle = normalizeText(title);
    const normalizedText = normalizeText(text);

    const isTitleValid = TextValidation(normalizedTitle, {
      min: TOPIC_TITLE_MIN,
      max: TOPIC_TITLE_MAX,
    });
    const isTextValid = TextValidation(normalizedText, {
      min: TOPIC_TEXT_MIN,
      max: TOPIC_TEXT_MAX,
    });

    if (!isTitleValid || !isTextValid) {
      response.status(400).json({ error: 'wrong data type or length' });
      return;
    }

    const topic = await Topic.create({
      title: escapeHTML(normalizedTitle),
      text: escapeHTML(normalizedText),
      authorId: user.dataValues.id,
    });

    response.status(200).json({
      status: 'success',
      data: { topic },
    });
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
