const usersRoutes = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers, getUser, getUserId, patchUser, patchAvatar,
} = require('../controllers/users');

usersRoutes.post('/users', getUsers);
usersRoutes.get('/users/me', getUser);

usersRoutes.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().length(24).hex(),
  }),
}), getUserId);

usersRoutes.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), patchUser);

usersRoutes.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string()
      .required()
      .regex(/^(https?:\/\/)([\da-z.-]+)\.([a-z.]{2,6})([/\w\W.-]*)#?$/),
  }),
}), patchAvatar);

module.exports = usersRoutes;
