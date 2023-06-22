import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { routes } from './routes';
const app = express();

app.use(
  cors({
    origin: [
      'https://menu-app-adm.netlify.app',
      'https://menu-app-gm.netlify.app',
      'https://menu-app-chef.netlify.app',
    ],
  })
);
app.use(express.json());
app.use('/api', express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(express.static('public/uploads'));

app.use(routes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port} 👍`);
});
