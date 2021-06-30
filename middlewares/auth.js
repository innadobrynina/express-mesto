const jwt = require('jsonwebtoken');
const AuthError = require('../errors/AuthError');

module.exports = (req, res, next) => {
  // достаём авторизационный заголовок
  const { authorization } = req.headers;

  // убеждаемся, что он есть или начинается с Bearer
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AuthError('Необходима авторизация');
  } else {
    // извлечём токен
    const token = authorization.replace('Bearer ', '');
    // верифицируем токен
    let payload;
    try {
      // попытаемся верифицировать токен
      payload = jwt.verify(token, 'some-secret-key');
    } catch (err) {
      // отправим ошибку, если не получилось
      throw new AuthError('Необходима авторизация');
    }
    req.user = payload; // записываем пейлоуд в объект запроса
    // возможно надо убрать return
    return next(); // пропускаем запрос дальше
  }
};
