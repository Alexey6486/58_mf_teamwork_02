import express from 'express';
import { protectController } from '../controllers/authentication';
import {
  getAllTopics,
  createTopic,
  deleteTopic,
} from '../controllers/forum';
import {
  getAllComments,
  createComment,
  createReply,
} from '../controllers/comment';

const routerForum = express.Router();

routerForum.route('/issues')
  .get(protectController, getAllTopics)

routerForum.route('/issue')
  .post(protectController, createTopic)
  .delete(protectController, deleteTopic);

routerForum.route('/issue/:issueId')
  .get(protectController, getAllComments)
  .post(protectController, createComment)

routerForum.route('/issue/:issueId/:commentId')
  .post(protectController, createReply)

export { routerForum };
