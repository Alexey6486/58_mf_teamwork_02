import express from 'express';
import { protect } from '../middlewares/protect';
import { getAllTopics, createTopic, deleteTopic } from '../controllers/forum';
import {
  getAllComments,
  createComment,
  createReply,
} from '../controllers/comment';
import { createReaction, deleteReaction } from '../controllers/reaction';

const routerForum = express.Router();

routerForum.route('/topics').get(protect, getAllTopics);

routerForum
  .route('/topic')
  .post(protect, createTopic)
  .delete(protect, deleteTopic);

routerForum
  .route('/topic/:topicId/comments')
  .get(protect, getAllComments);

routerForum
  .route('/topic/:topicId/comment')
  .post(protect, createComment);

routerForum
  .route('/topic/:topicId/comment/:commentId/reply')
  .post(protect, createReply);

routerForum
  .route('/topic/:topicId/comment/:commentId/reaction')
  .post(protect, createReaction)
  .delete(protect, deleteReaction);

export { routerForum };
