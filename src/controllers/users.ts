import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { IUserRequest, ISessionRequest } from '../utils/types';
import { SERVER_ERROR, INCORRECT_DATA_ERROR, NOT_FOUND_ERROR } from '../utils/response-codes';
import User from '../models/user';
import { jwtKey } from '../utils/constants';

export const getCurrentUser = (req:ISessionRequest, res:Response) => {
  const userId = req.user;
  User.findById(userId)
    .then((user) => {
      res.send(user);
    })
    .catch((e) => res.status(SERVER_ERROR).send(e.message));
};

export const getUsers = (req:Request, res:Response) => User.find({})
  .then((users) => res.send(users))
  .catch((err) => res.status(SERVER_ERROR).send({ message: err.message }));

export const getUser = (req:Request, res:Response) => {
  const { userId } = req.params;
  return User.findById(userId)
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
          res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

export const createUser = (req:Request, res:Response) => {
  const {
    email, password, name, about, avatar,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email, password: hash, name, about, avatar,
    }))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(INCORRECT_DATA_ERROR).send({ message: 'Переданы некорректные данные пользователя' });
      } else res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
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
          res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
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
          res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

export const login = (req:Request, res:Response) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const { _id } = user;
      const token = jwt.sign({ _id }, jwtKey, { expiresIn: '7d' });
      res.cookie('token', token, { httpOnly: true }).send(user);
    })
    .catch((err) => res.status(401).send({ message: err.message }));
};
