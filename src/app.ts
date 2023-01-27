import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import usersRouter from './routes/users';
import cardsRouter from './routes/cards';
import { login, createUser } from './controllers/users';
import authMiddleware from './middlewares/auth';

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/signin', login);
app.post('/signup', createUser);

app.use(authMiddleware);

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT);
