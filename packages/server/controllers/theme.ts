import type { Response, Request } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { User } from '../db';
import { TTheme } from '../models/user';

export const getTheme = catchAsync(
  async (request: Request, response: Response) => {
    const { userId } = request.body;

    const user = await User.findOne({
      attributes: ['theme'],
      where: { userId: userId },
    });

    if (!user) {
      const [data] = await User.upsert(
        {
          userId: parseInt(userId),
          theme: TTheme.light,
        },
        { returning: true }
      );

      response.status(200).json({
        status: 'success',
        data: {
          theme: data.dataValues.theme,
        },
      });
    } else {
      response.status(200).json({
        status: 'success',
        data: {
          theme: user.dataValues.theme,
        },
      });
    }
  }
);

export const updateTheme = catchAsync(
  async (request: Request, response: Response) => {
    const { userId, theme } = request.body;

    const user = await User.findOne({
      where: { userId: userId },
    });

    if (!user) {
      response.status(404).json({ status: 'error', error: 'User not found' });
    } else {
      await user.update({
        theme,
      });

      response.status(200).json({
        status: 'success',
        data: {
          theme,
        },
      });
    }
  }
);
