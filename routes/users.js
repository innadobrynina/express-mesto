const usersRoutes = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers, getUser, getUserId, patchUser, patchAvatar,
} = require('../controllers/users');

usersRoutes.get('/users', getUser);
usersRoutes.get('/users/me', getUsers);

usersRoutes.get('/users/:userId', getUserId);

usersRoutes.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), patchUser);

usersRoutes.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().min(10),
  }),
}), patchAvatar);

module.exports = usersRoutes;
