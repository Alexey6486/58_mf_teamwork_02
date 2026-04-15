import express from 'express';
import { getTheme, updateTheme } from '../controllers/theme';
import { protectController } from '../controllers/authentication';

const routerTheme = express.Router();

routerTheme
  .route('/')
  .get(protectController, getTheme)
  .put(protectController, updateTheme);

export { routerTheme };
