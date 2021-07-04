const jwt = require('jsonwebtoken');
const NotFoundUserError = require('../errors/NotFoundError');

// eslint-disable-next-line consistent-return
const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Необходимо авторизоваться' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'secret-key');
  } catch (err) {
    return next(new NotFoundUserError('Неверный токен'));
  }

  req.user = payload;

  next();
};

module.exports = { auth };
