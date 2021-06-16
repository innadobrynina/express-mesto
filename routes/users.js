const usersRoutes = require('express').Router();

const {
  createUser, getUser, getUserId, patchUser, patchAvatar,
} = require('../controllers/users');

usersRoutes.post('/users', createUser);
usersRoutes.get('/users', getUser);
usersRoutes.get('/users/:userId', getUserId);
usersRoutes.patch('/users/me', patchUser);
usersRoutes.patch('/users/me/avatar', patchAvatar);

module.exports = usersRoutes;
