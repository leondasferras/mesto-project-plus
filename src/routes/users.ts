import { Router } from 'express';
import { validateUserInfoUpdate, validateAvatarUpdate, validateGetUser } from '../utils/celebrate-validadtors';
import {
  getUsers,
  updateUserInfo,
  updateUserAvatar,
  getUser,
  getCurrentUser,
} from '../controllers/users';

const router = Router();

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', validateGetUser, getUser);

router.patch('/me', validateUserInfoUpdate, updateUserInfo);
router.patch('/me/avatar', validateAvatarUpdate, updateUserAvatar);

export default router;
