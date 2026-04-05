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
} from '../controllers/comment';

const routerForum = express.Router();

routerForum.route('/')
  .get(protectController, getAllTopics)
  .post(protectController, createTopic)
  .delete(protectController, deleteTopic);

routerForum.route('/issue/:issueId')
  .get(protectController, getAllComments)
  .post(protectController, createComment)

export { routerForum };
