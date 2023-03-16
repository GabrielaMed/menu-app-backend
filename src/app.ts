import express from 'express';
import morgan from 'morgan';
import * as teste from './routes';
export const app = express();

app.use(morgan('dev'));
app.use(express.json());

app.use('/', teste.routes);
