const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    res.status(403).send({ message: 'authorization needed' });
    return;
  }

  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, 'key');
  } catch (err) {
    res.status(401).send({ message: 'no token' });
    return;
  }

  req.user = payload;

  next();
};
