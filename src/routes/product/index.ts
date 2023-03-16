import { Router } from 'express';
import { createProductController } from '../../controllers/product/createProductController';

export const routes = Router();

routes.route('/').post(createProductController.handle);
