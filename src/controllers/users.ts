import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { IUserRequest, ISessionRequest } from '../utils/types';
import NotFoundError from '../utils/errors/not-found';
import ConflictingRequestError from '../utils/errors/conflicting-request';
import User from '../models/user';
import { jwtKey } from '../utils/constants';

export const getCurrentUser = (req:ISessionRequest, res:Response, next:NextFunction) => {
  const userId = req.user;
  User.findById(userId)
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};

export const getUsers = (req:Request, res:Response, next:NextFunction) => User.find({})
  .then((users) => res.send(users))
  .catch(next);

export const getUser = (req:Request, res:Response, next:NextFunction) => {
  const { userId } = req.params;
  return User.findById(userId)
    .then((user) => {
      if (!user) { throw new NotFoundError('Запрашиваемый пользователь не найден'); }
      res.send(user);
    })
    .catch(next);
};

export const createUser = (req:Request, res:Response, next:NextFunction) => {
  const {
    email, password, name, about, avatar,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email, password: hash, name, about, avatar,
    }))
    .then((user) => res.send({ data: user }))
    .catch(((e) => {
      if (e.code === 11000) {
        next(new ConflictingRequestError('Пользователь с таким e-mail уже существует'));
      } else { next(e); }
    }));
};

export const updateUserInfo = (req:IUserRequest, res:Response, next:NextFunction) => {
  const _id = req.user;
  const { name, about } = req.body;
  return User.findByIdAndUpdate(_id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) { throw new NotFoundError('Запрашиваемый пользователь не найден'); }
      res.send({ data: user });
    })
    .catch(next);
};

export const updateUserAvatar = (req:IUserRequest, res:Response, next:NextFunction) => {
  const _id = req.user;
  const { avatar } = req.body;
  return User.findByIdAndUpdate(_id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) { throw new NotFoundError('Запрашиваемый пользователь не найден'); }
      res.send({ data: user });
    })
    .catch(next);
};

export const login = (req:Request, res:Response, next:NextFunction) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const { _id } = user;
      const token = jwt.sign({ _id }, jwtKey, { expiresIn: '7d' });
      res.cookie('token', token, { httpOnly: true }).send(user);
    })
    .catch(next);
};
