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
import { getCompanyByIdController } from './controllers/company/getCompanyByIdController';
import { getProductByCompanyController } from './controllers/product/getProductByCompanyController';
import { updateProductController } from './controllers/product/updateProductController';
import { createOrderController } from './controllers/order/createOrderController';
import { getOrderByVisitorController } from './controllers/order/getOrderByVisitorController';
import { relatesOrderAndProductController } from './controllers/order/relatesOrderAndProductController';
import { relatesOrderProductAndAdditionalController } from './controllers/order/relatesOrderProductAndAdditionalController';
import { updateOrderController } from './controllers/order/updateOrderController';
import { deleteOrderProductController } from './controllers/order/deleteOrderProductController';
import { getOrdersByCompanyIdController } from './controllers/order/getOrdersByCompanyIdController';
import { getOrdersByIdController } from './controllers/order/getOrderByIdController';
import { deleteImageByIdController } from './controllers/product/deleteImageByIdController';
import { changeOrderStatusController } from './controllers/order/changeOrderStatusController';
import { createTableController } from './controllers/tableQrCode/createTableController';
import { getTablesByCompanyController } from './controllers/tableQrCode/getTablesByCompanyController';
import { createOrdersCardController } from './controllers/ordersCard/createOrdersCardController';
import { getOpenOrdersCardByVisitorController } from './controllers/ordersCard/getOpenOrdersCardByVisitorController';
import { getOrdersCardByTableController } from './controllers/ordersCard/getOrdersCardByTableController';
import { changeOrdersCardStatusController } from './controllers/ordersCard/changeOrdersCardStatusController';

const routes = Router();

const prefix = 'v1';

routes
  .route(`/${prefix}/:companyId/product`)
  .post(createProductController.createProduct)
  .get(getProductByCompanyController.handle);

routes.put(
  `/${prefix}/:companyId/product/:productId`,
  updateProductController.handle
);

routes.post(
  `/${prefix}/product/:productId/image`,
  multer(multerConfig).single('file'),
  saveImagesController.handle
);

routes.delete(`/${prefix}/image/:imageId`, deleteImageByIdController.handle);

routes.get(`/${prefix}/product/:productId`, getProductByIdController.handle);

routes.get(
  `/${prefix}/product/:productId/image`,
  getProductImagesController.handle
);
routes.get(
  `/${prefix}/product/:productId/additionals`,
  getAdditionalInProductByIdController.handle
);

routes
  .route(`/${prefix}/:companyId/additionals`)
  .get(getAdditionalByCompanyController.handle)
  .post(createAdditionalController.handle);

routes.post(
  `/${prefix}/product/:productId/:additionalId`,
  relatesAdditionalProductController.handle
);

routes.get(`/${prefix}/company/:companyId`, getCompanyByIdController.handle);

routes
  .route(`/${prefix}/orders_card/:visitorUuid`)
  .post(
    getOpenOrdersCardByVisitorController.handle,
    createOrdersCardController.handle
  );

routes.post(
  `/${prefix}/orders_card/table/:tableNumber`,
  getOrdersCardByTableController.handle
);

routes.post(
  `/${prefix}/orders_card/:ordersCardId/status`,
  changeOrdersCardStatusController.handle
);

routes.post(`/${prefix}/order`, createOrderController.handle);

routes
  .route(`/${prefix}/order/:orderId`)
  .post(
    relatesOrderAndProductController.handle,
    relatesOrderProductAndAdditionalController.handle
  )
  .put(updateOrderController.handle)
  .delete(deleteOrderProductController.handle)
  .get(getOrdersByIdController.handle);

routes.get(
  `/${prefix}/order/visitor/:visitorUuid/:companyId`,
  getOrderByVisitorController.handle
);

routes.get(
  `/${prefix}/order/company/:companyId`,
  getOrdersByCompanyIdController.handle
);

routes.put(
  `/${prefix}/order/:orderId/status`,
  changeOrderStatusController.handle
);

routes.route(`/${prefix}/table`).post(createTableController.handle);

routes
  .route(`/${prefix}/:companyId/tables`)
  .get(getTablesByCompanyController.handle);
export { routes };
