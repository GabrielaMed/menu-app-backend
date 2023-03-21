import { Router } from 'express';
import { createProductController } from './controllers/product/createProductController';
import { createAdditionalController } from './controllers/additional/createAdditionalController';
import { relatesAdditionalProductController } from './controllers/relatesAdditionalProduct/relatesAdditionalProductController';
const routes = Router();

routes.post(
  '/api/product',
  createProductController.createProduct,
  createAdditionalController.createAdditionals,
  relatesAdditionalProductController.handle
);

export { routes };
