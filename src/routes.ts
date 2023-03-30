import { Router } from 'express';
import { createProductController } from './controllers/product/createProductController';
import { createAdditionalController } from './controllers/additional/createAdditionalController';
import { relatesAdditionalProductController } from './controllers/relatesAdditionalProduct/relatesAdditionalProductController';
import multer from 'multer';
import * as multerConfig from './config/multer';
import { saveImagesController } from './controllers/product/saveImagesController';

const routes = Router();

routes.post(
  '/api/:companyId/product',
  createProductController.createProduct,
  createAdditionalController.createAdditionals,
  relatesAdditionalProductController.handle
);

routes.post(
  '/api/:productId/image',
  multer(multerConfig).single('file'),
  saveImagesController.handle
);

export { routes };
