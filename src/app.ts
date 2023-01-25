import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import usersRouter from './routes/users';
import userRouter from './routes/user';
import cardsRouter from './routes/cards';
import { IUserRequest } from './utils/types';

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');
const mongoose1 = require('mongoose');

const staticUserId = mongoose1.Types.ObjectId('63d00b1f62c0c11644f0f4d3');

app.use((req:IUserRequest, _, next) => {
  req.user = { _id: staticUserId };
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/user', userRouter);
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT);
