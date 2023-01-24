import { Request, Response } from "express";
import User from "models/user";

export const getUsers = (req:Request, res:Response) => {
  return User.find({})
  .then(users => res.send(users))
  .catch(err => res.status(500).send({ message: err.message }));
}

export const getUser = (req:Request, res:Response) => {
  const {_id} = req.body;
  return User.findOne({_id})
  .then(user => res.send(user))
  .catch(err => res.status(500).send({ message: "Такого пользователя нет!" }));
}