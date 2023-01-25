import { Request, Response } from 'express';
import { IUserRequest } from '../utils/types';
import { SERVER_ERROR, INCORRECT_DATA_ERROR, NOT_FOUND_ERROR } from '../utils/response-codes';
import User from '../models/user';

export const getUsers = (req:Request, res:Response) => User.find({})
  .then((users) => res.send(users))
  .catch((err) => res.status(SERVER_ERROR).send({ message: err.message }));

export const getUser = (req:Request, res:Response) => {
  const { _id } = req.body;
  return User.findById(_id)
    .then((user) => {
      if (!user) { const e = new Error('Запрашиваемый пользователь не найден'); e.name = 'notFound'; throw e; }
      res.send(user);
    })
    .catch((e) => {
      switch (e.name) {
        case 'CastError':
          res.status(INCORRECT_DATA_ERROR).send({ message: 'Переданы некорректные данные пользователя' });
          break;
        case 'notFound':
          res.status(NOT_FOUND_ERROR).send({ message: e.message });
          break;
        default:
          res.status(SERVER_ERROR).send({ message: 'Ошибка сервера' });
      }
    });
};

export const createUser = (req:Request, res:Response) => {
  const { name, about, avatar } = req.body;
  return User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(INCORRECT_DATA_ERROR).send({ message: 'Неверный формат данных' });
      } else res.status(SERVER_ERROR).send({ message: 'Ошибка сервера' });
    });
};

export const updateUserInfo = (req:IUserRequest, res:Response) => {
  const _id = req.user;
  const { name, about } = req.body;
  return User.findByIdAndUpdate(_id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) { const e = new Error('Запрашиваемый пользователь не найден'); e.name = 'notFound'; throw e; }
      res.send({ data: user });
    })
    .catch((e) => {
      switch (e.name) {
        case 'ValidationError':
          res.status(INCORRECT_DATA_ERROR).send({ message: 'Переданы некорректные данные пользователя' });
          break;
        case 'notFound':
          res.status(NOT_FOUND_ERROR).send({ message: e.message });
          break;
        default:
          res.status(SERVER_ERROR).send({ message: 'Ошибка сервера' });
      }
    });
};

export const updateUserAvatar = (req:IUserRequest, res:Response) => {
  const _id = req.user;
  const { avatar } = req.body;
  return User.findByIdAndUpdate(_id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) { const e = new Error('Запрашиваемый пользователь не найден'); e.name = 'notFound'; throw e; }
      res.send({ data: user });
    })
    .catch((e) => {
      switch (e.name) {
        case 'ValidationError':
          res.status(INCORRECT_DATA_ERROR).send({ message: 'Переданы некорректные данные пользователя' });
          break;
        case 'notFound':
          res.status(NOT_FOUND_ERROR).send({ message: e.message });
          break;
        default:
          res.status(SERVER_ERROR).send({ message: 'Ошибка сервера' });
      }
    });
};
