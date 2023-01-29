import { Request, Response, NextFunction } from 'express';
import Card from '../models/card';
import { IUserRequest } from '../utils/types';
import NotFoundError from '../utils/errors/not-found';
import PermissionError from '../utils/errors/permission';

export const getCards = (req:Request, res:Response, next:NextFunction) => Card.find({})
  .then((cards) => res.send(cards))
  .catch(next);

export const createCard = (req:IUserRequest, res:Response, next:NextFunction) => {
  const { name, link } = req.body;
  const owner = req.user;
  return Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch(next);
};

export const deleteCard = (req:IUserRequest, res:Response, next:NextFunction) => {
  const { cardId } = req.params;
  const userId = req.user;
  return Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным _id не найдена.');
      } else if (card.owner.toString() !== userId!.toString()) {
        throw new PermissionError('Нельзя удалять чужие карточки');
      } else {
        card.delete();
        res.send(card);
      }
    })
    .catch(next);
};

export const likeCard = (req:IUserRequest, res:Response, next:NextFunction) => {
  const { cardId } = req.params;
  const { _id } = req.user!;
  return Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: _id } },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (!card) { throw new NotFoundError('Карточка с указанным _id не найдена.'); }
      res.send(card);
    })
    .catch(next);
};
export const unlikeCard = (req:IUserRequest, res:Response, next:NextFunction) => {
  const { cardId } = req.params;
  const { _id } = req.user!;
  return Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: _id } },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (!card) { throw new NotFoundError('Карточка с указанным _id не найдена.'); }
      res.send(card);
    })
    .catch(next);
};
