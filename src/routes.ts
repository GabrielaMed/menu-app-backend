import { Router } from 'express';
import { createProductController } from './controllers/product/createProductController';
import { createAdditionalController } from './controllers/additional/createAdditionalController';
import { relatesAdditionalProductController } from './controllers/relatesAdditionalProduct/relatesAdditionalProductController';
import multer from 'multer';
import * as multerConfig from './config/multer';
import { saveImagesController } from './controllers/product/saveImagesController';
import { getProductByIdController } from './controllers/product/getProductByIdController';
import { getProductImagesController } from './controllers/product/getProductImagesController';
import { getAdditionalInProductByIdController } from './controllers/additional/getAdditionalInProductByIdController';
import { getAdditionalByCompanyController } from './controllers/additional/getAdditionalByCampanyController';

const routes = Router();

routes.post('/v1/:companyId/product', createProductController.createProduct);

routes.post(
  '/v1/product/:productId/image',
  multer(multerConfig).single('file'),
  saveImagesController.handle
);

routes.get('/v1/product/:productId', getProductByIdController.handle);
routes.get('/v1/product/:productId/image', getProductImagesController.handle);
routes.get(
  '/v1/product/:productId/additionals',
  getAdditionalInProductByIdController.handle
);

routes
  .route('/v1/:companyId/additionals')
  .get(getAdditionalByCompanyController.handle)
  .post(createAdditionalController.handle);

routes.post(
  '/v1/product/:productId/:additionalId',
  relatesAdditionalProductController.handle
);

export { routes };
