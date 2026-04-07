import express from 'express';
import { protectController } from '../controllers/authentication';
import { getAllTopics, createTopic, deleteTopic } from '../controllers/forum';
import {
  getAllComments,
  createComment,
  createReply,
} from '../controllers/comment';
import { createReaction, deleteReaction } from '../controllers/reaction';

const routerForum = express.Router();

routerForum.route('/topics').get(protectController, getAllTopics);

routerForum
  .route('/topic')
  .post(protectController, createTopic)
  .delete(protectController, deleteTopic);

routerForum
  .route('/topic/:topicId/comments')
  .get(protectController, getAllComments);

routerForum
  .route('/topic/:topicId/comment')
  .post(protectController, createComment);

routerForum
  .route('/topic/:topicId/comment/:commentId/reply')
  .post(protectController, createReply);

routerForum
  .route('/topic/:topicId/comment/:commentId/reaction')
  .post(protectController, createReaction)
  .delete(protectController, deleteReaction);

export { routerForum };
