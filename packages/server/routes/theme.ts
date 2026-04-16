import express from 'express';
import { getTheme, updateTheme } from '../controllers/theme';

const routerTheme = express.Router();

routerTheme
  .route('/')
  .post(getTheme)
  .put(updateTheme);

export { routerTheme };
