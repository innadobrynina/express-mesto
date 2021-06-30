const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const AuthError = require('../errors/AuthError');
const BadRequestError = require('../errors/BadRequestError');

// создаем пользователя
module.exports.createUser = (req, res, next) => {
  const {
    name, avatar, about,
  } = req.body;
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name, about, avatar, email: req.body.email, password: hash,
    }))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'MongoError' && err.code === 11000) {
        throw new BadRequestError('Переданы некорректные данные');
      }
    })
    .catch(next);
};

// возвращаем всех пользователей
module.exports.getUser = (req, res, next) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(next);
};

// возвращаем информацию о текущем пользователе
module.exports.getUsers = (req, res, next) => {
  User.findById(req.user)
    .then((user) => {
      res.send({ data: user });
    })
    .catch(next);
};

// возвращаем пользователя по id
module.exports.getUserId = (req, res, next) => {
  if (req.params.userId.length !== 24) {
    throw new BadRequestError('Переданы некорректные данные');
  } else {
    User.findById(req.params.userId)
      .then((user) => {
        if (user === null) {
          throw new NotFoundError('Запрашиваемый пользователь не найден');
        } else {
          res.send({ data: user });
        }
      })
      .catch(next);
  }
};

// обновляем профиль пользователя
module.exports.patchUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (user === null) {
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные');
      }
    })
    .catch(next);
};

// обновляем аватар
module.exports.patchAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (user === null) {
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные');
      }
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(() => {
      // ошибка аутентификации
      throw new AuthError('Необходима авторизация');
    })
    .catch(next);
};
