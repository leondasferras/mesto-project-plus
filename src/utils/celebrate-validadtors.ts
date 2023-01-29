import { celebrate, Joi } from 'celebrate';
import { linkPattern } from './constants';

// user validators
export const validateCreateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
    avatar: Joi.string().pattern(linkPattern),
  }),
});

export const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

export const validateUserInfoUpdate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(200),
  }),
});

export const validateAvatarUpdate = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(linkPattern),
  }),
});

// card validators
export const validateCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().pattern(linkPattern),
  }),
});
