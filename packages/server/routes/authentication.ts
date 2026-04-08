import express from 'express';
import { signin, signout } from '../controllers/authentication';

const routerAuthentication = express.Router();

routerAuthentication.route('/signin').post(signin);

routerAuthentication.route('/signout').post(signout);

export { routerAuthentication };
