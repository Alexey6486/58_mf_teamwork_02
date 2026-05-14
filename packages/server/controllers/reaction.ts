import type { Response, Request } from 'express';
import { Comment, Topic, Reaction, User } from '../db';
import { catchAsync } from '../utils/catchAsync';
import { normalizeText, toPositiveInt } from '../utils/validation';
import { escapeHTML } from '../utils/xss';
import { REACTIONS } from '../constants/constrains';

export const createReaction = catchAsync(
  async (request: Request, response: Response) => {
    const { topicId, commentId, authorId, text, id } = request.body as {
      topicId?: unknown;
      commentId?: unknown;
      authorId?: unknown;
      text?: unknown;
      id?: unknown;
    };

    const topicIdNum = toPositiveInt(topicId);
    const commentIdNum = toPositiveInt(commentId);
    const authorExternalId = toPositiveInt(authorId);
    const reactionId =
      id === null || id === undefined || id === ''
        ? undefined
        : toPositiveInt(id);

    if (!topicIdNum || !commentIdNum || !authorExternalId) {
      response.status(400).json({ error: 'wrong ids' });
      return;
    }

    const normalizedText = normalizeText(text);
    if (!REACTIONS.includes(normalizedText)) {
      response.status(400).json({ error: 'wrong reaction type' });
      return;
    }

    const user = await User.findOne({ where: { userId: authorExternalId } });
    if (!user) {
      response.status(400).json({ error: 'user not found' });
      return;
    }
    const foundUserId = user.dataValues.id;

    const targetTopic = await Topic.findByPk(topicIdNum);
    const targetComment = await Comment.findByPk(commentIdNum);

    if (
      !targetTopic ||
      !targetComment ||
      targetComment.dataValues.topicId !== topicIdNum
    ) {
      response.status(400).json({ error: 'topic or comment not found' });
      return;
    }

    if (!reactionId) {
      const reaction = await Reaction.create({
        topicId: topicIdNum,
        commentId: commentIdNum,
        authorId: foundUserId,
        text: escapeHTML(normalizedText),
      });

      response.status(200).json({
        status: 'success',
        data: { reaction },
      });
      return;
    }

    const reaction = await Reaction.findByPk(reactionId);
    if (!reaction) {
      response.status(400).json({ error: 'wrong id' });
      return;
    }

    await reaction.update({
      topicId: topicIdNum,
      commentId: commentIdNum,
      authorId: foundUserId,
      text: escapeHTML(normalizedText),
    });

    response.status(200).json({
      status: 'success',
      data: { reaction },
    });
  }
);

export const deleteReaction = catchAsync(
  async (request: Request, response: Response) => {
    const id = toPositiveInt(request.body?.id);

    if (!id) {
      response.status(400).json({ error: 'wrong id' });
      return;
    }

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
