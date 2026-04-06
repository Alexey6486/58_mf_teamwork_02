import express from 'express';
import { protectController } from '../controllers/authentication';

const routerAuthentication = express.Router();

routerAuthentication.route('/').post(protectController);

export { routerAuthentication };
