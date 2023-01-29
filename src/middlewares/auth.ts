import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import AuthError from '../utils/errors/auth';
import { jwtKey } from '../utils/constants';
import { ISessionRequest } from '../utils/types';

interface JwtPayload {
  _id:string;
}

export default (req:ISessionRequest, res:Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AuthError('Необходимо авторизоваться');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, jwtKey) as JwtPayload;
  } catch (error) {
    throw new AuthError('Необходимо авторизоваться');
  }

  req.user = payload._id;
  return next();
};
