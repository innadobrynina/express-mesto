const usersRoutes = require('express').Router();
const { auth } = require('../middlewares/auth');
const { validateUserId, validateUserInfo } = require('../middlewares/celebrate');

const {
  getUsers, getCurrentUser, getUserId, patchUser, patchAvatar,
} = require('../controllers/users');

usersRoutes.get('/users', getUsers);
usersRoutes.get('/users/me', auth, getCurrentUser);

usersRoutes.get('/users/:userId', validateUserId, getUserId);

usersRoutes.patch('/users/me', validateUserInfo, patchUser);

usersRoutes.patch('/users/me/avatar', validateUserInfo, patchAvatar);

module.exports = usersRoutes;
