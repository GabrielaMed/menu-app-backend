import { Router } from 'express';
import { CreateProductController } from './controllers/product/createProductController';
const routes = Router();

const test = new CreateProductController();
routes.post('/api/product', test.createProduct, test.createAdditionals);

// routes.post("/api/event/", createEventController.createEvent);
// routes.get("/api/event/", createEventController.getEvents);

export { routes };
