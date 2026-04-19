import express from 'express';
import { getAllTopics, createTopic, deleteTopic } from '../controllers/forum';
import {
  getAllComments,
  createComment,
  createReply,
} from '../controllers/comment';
import { createReaction, deleteReaction } from '../controllers/reaction';

const routerForum = express.Router();

routerForum.route('/topics').get(getAllTopics);

routerForum.route('/topic').post(createTopic).delete(deleteTopic);

routerForum.route('/topic/:topicId/comments').get(getAllComments);

routerForum.route('/topic/:topicId/comment').post(createComment);

routerForum.route('/topic/:topicId/comment/:commentId/reply').post(createReply);

routerForum
  .route('/topic/:topicId/comment/:commentId/reaction')
  .post(createReaction)
  .delete(deleteReaction);

export { routerForum };
