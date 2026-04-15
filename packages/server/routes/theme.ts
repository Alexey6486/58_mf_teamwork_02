import express from 'express';
import { getTheme, updateTheme } from '../controllers/theme';
import { protect } from '../middlewares/protect';

const routerTheme = express.Router();

routerTheme
  .route('/')
  .post(protect, getTheme)
  .put(protect, updateTheme);

export { routerTheme };
