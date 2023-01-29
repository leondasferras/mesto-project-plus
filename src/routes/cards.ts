import { Router } from 'express';
import {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  unlikeCard,
} from '../controllers/cards';
import {
  validateCreateCard,
  validateDeleteCard,
  validateLikeCard,
  validateUnlikeCard,
} from '../utils/celebrate-validadtors';

const router = Router();

// get all cards
router.get('/', getCards);

// like and unlike cards
router.put('/:cardId/likes', validateLikeCard, likeCard);
router.delete('/:cardId/likes', validateUnlikeCard, unlikeCard);

// create and delete card
router.post('/', validateCreateCard, createCard);
router.delete('/:cardId', validateDeleteCard, deleteCard);

export default router;
