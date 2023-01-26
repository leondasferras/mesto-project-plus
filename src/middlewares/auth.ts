import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AUTH_ERROR } from '../utils/response-codes';
import { jwtKey } from '../utils/constants';
import { ISessionRequest } from '../utils/types';

export default (req:ISessionRequest, res:Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(AUTH_ERROR).send({ message: 'Необходима авторизация' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, jwtKey);
    console.log(payload);
  } catch (error) {
    return res.status(AUTH_ERROR).send({ message: 'Необходима авторизация' });
  }

  req.user = payload;
  next();
};
