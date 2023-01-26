import { Router } from 'express';
import {
  getUsers,
  createUser,
  updateUserInfo,
  updateUserAvatar,
  getUser,
  getCurrentUser,
} from '../controllers/users';

const router = Router();

router.get('/', getUsers);
router.post('/', createUser);
router.get('/:userId', getUser);

router.get('./me', getCurrentUser);
router.patch('/me', updateUserInfo);
router.patch('/me/avatar', updateUserAvatar);

export default router;
