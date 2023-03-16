import express from 'express';
import morgan from 'morgan';
import * as product from './routes/product';
export const app = express();

app.use(morgan('dev'));
app.use(express.json());

app.use('/api/product', product.routes);
