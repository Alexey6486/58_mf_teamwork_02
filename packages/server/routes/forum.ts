import express from 'express';
import { protectController } from '../controllers/authentication';
import { getAllTopics } from '../controllers/forum';

const routerForum = express.Router();

routerForum.route('/')
  .get(protectController, getAllTopics);

export { routerForum };
