import type { Response, Request } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { getHeaders } from './headers/headers';
import { APIFeatures } from '../utils/apiFeatures';
import { TopicSequelized } from '../db';

export const getAllTopics = catchAsync(async (request: Request, response: Response) => {
  console.log('getAllTopics', { rq: request.query });
  const topics = await TopicSequelized.findAll();

  console.log('getAllTopics topics', { topics });
  const topicsPrepared = new APIFeatures(topics, request.query)
    .filter().sort().pagination();
  console.log('getAllTopics topicsPrepared', { topicsPrepared });

  // execute query
  const queryResult = await topicsPrepared.query;
  console.log('topics result', { queryResult });

  // send response
  response.set(getHeaders).status(200)
    .json({
      status: 'success',
      // total: queryResult.length,
      total: 0,
      data: {
        topics: queryResult
      },
    })
});
