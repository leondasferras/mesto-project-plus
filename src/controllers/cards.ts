import { Request, Response } from "express";
import Card from "../models/card";
import {IUserRequest} from "../app"

export const getCards = (req:Request, res:Response) => {
  return Card.find({})
  .then(cards => res.send(cards))
  .catch(err => res.status(500).send({ message: err.message }));
}

export const createCard = (req:IUserRequest, res:Response) => {
  const {name, link} = req.body;
  const owner = req.user;
  return Card.create({name, link, owner})
  .then(card => res.send({data:card}))
  .catch(()=> res.status(500).send({message: 'Произошла ошибка!'}))
}

export const deleteCard = (req:Request, res:Response) => {
  const {cardId} = req.params;
  return Card.findByIdAndRemove(cardId)
  .then(card => res.send({data:card}))
  .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
}