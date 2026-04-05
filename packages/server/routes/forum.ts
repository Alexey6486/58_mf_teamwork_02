import express from 'express';
import { protectController } from '../controllers/authentication';
import { getAllTopics, createTopics } from '../controllers/forum';

const routerForum = express.Router();

routerForum.route('/')
  .get(protectController, getAllTopics)
  .post(protectController, createTopics);

export { routerForum };
