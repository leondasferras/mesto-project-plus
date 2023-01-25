import { Router } from 'express';
import {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  unlikeCard,
} from '../controllers/cards';

const router = Router();

// get all cards
router.get('/', getCards);

// create and delete card
router.post('/', createCard);
router.delete('/:cardId', deleteCard);

// like and unlike cards
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', unlikeCard);

export default router;
