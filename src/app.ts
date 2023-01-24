import express from 'express';
import { Request, Response } from "express";
import mongoose from 'mongoose';
import path from 'path';
import usersRouter from './routes/users';
import userRouter from './routes/user';
import cardsRouter from './routes/cards';

export interface IUserRequest extends Request {
  user?: {
    _id:string;
  };
}


const { PORT = 3000 } = process.env;
const app = express();



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');


app.use((req:IUserRequest, res, next) => {
  req.user = {
    _id: '63d00b1f62c0c11644f0f4d3' 
  };

app.use('/user', userRouter);
app.use('/users', usersRouter);
app.use('/cards', cardsRouter)



  next();
});





app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
 console.log('есть контакт!')
});



// 63d00b1f62c0c11644f0f4d3