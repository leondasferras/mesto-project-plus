import express from 'express';
import mongoose from 'mongoose';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import path from 'path';
import { errors } from 'celebrate';
import usersRouter from './routes/users';
import cardsRouter from './routes/cards';
import { login, createUser } from './controllers/users';
import authMiddleware from './middlewares/auth';
import errorsMiddleware from './middlewares/error';
import { validateLogin, validateCreateUser } from './utils/celebrate-validadtors';
import { requestsLogger, errorsLogger } from './middlewares/logger';

const { PORT = 3000 } = process.env;
const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);
app.use(helmet());
mongoose.connect('mongodb://localhost:27017/mestodb');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestsLogger);

app.post('/signin', validateLogin, login);
app.post('/signup', validateCreateUser, createUser);
app.use(authMiddleware);
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use(express.static(path.join(__dirname, 'public')));

app.use(errorsLogger);
app.use(errors());
app.use(errorsMiddleware);

app.listen(PORT);
