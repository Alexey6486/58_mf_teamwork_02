import express from 'express';
import { signin, signout } from '../controllers/authentication';
import { protect } from '../middlewares/protect';

const routerAuthentication = express.Router();

routerAuthentication.route('/signin').post(signin);

routerAuthentication.route('/signout').post(protect, signout);

export { routerAuthentication };
