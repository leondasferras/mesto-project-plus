import { Request, Response } from 'express';
import Card from '../models/card';
import { IUserRequest } from '../utils/types';
import { SERVER_ERROR, INCORRECT_DATA_ERROR, NOT_FOUND_ERROR } from '../utils/response-codes';

export const getCards = (req:Request, res:Response) => Card.find({})
  .then((cards) => res.send(cards))
  .catch(() => res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' }));

export const createCard = (req:IUserRequest, res:Response) => {
  const { name, link } = req.body;
  const owner = req.user;
  return Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((e) => {
      if (e.name === 'ValidationError') {
        res.status(INCORRECT_DATA_ERROR).send({ message: 'Отправлены некорректные данные карточки' });
      } else res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

export const deleteCard = (req:Request, res:Response) => {
  const { cardId } = req.params;
  return Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) { const e = new Error('Карточка с указанным _id не найдена.'); e.name = 'notFound'; throw e; }
      res.send(card);
    })
    .catch(() => res.status(NOT_FOUND_ERROR).send({ message: 'Карточка с указанным _id не найдена' }));
};

export const likeCard = (req:IUserRequest, res:Response) => {
  const { cardId } = req.params;
  const { _id } = req.user!;
  return Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: _id } },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (!card) { const e = new Error('Карточка с указанным _id не найдена.'); e.name = 'notFound'; throw e; }
      res.send(card);
    })
    .catch((e) => {
      switch (e.name) {
        case 'CastError':
          res.status(INCORRECT_DATA_ERROR).send({ message: 'Переданы некорректные данные карточки' });
          break;
        case 'notFound':
          res.status(NOT_FOUND_ERROR).send({ message: e.message });
          break;
        default:
          res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};
export const unlikeCard = (req:IUserRequest, res:Response) => {
  const { cardId } = req.params;
  const { _id } = req.user!;
  return Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: _id } },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (!card) { const e = new Error('Карточка с указанным _id не найдена.'); e.name = 'notFound'; throw e; }
      res.send(card);
    })
    .catch((e) => {
      switch (e.name) {
        case 'CastError':
          res.status(INCORRECT_DATA_ERROR).send({ message: 'Переданы некорректные данные карточки' });
          break;
        case 'notFound':
          res.status(NOT_FOUND_ERROR).send({ message: e.message });
          break;
        default:
          res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};
