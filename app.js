const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const { PORT = 3000 } = process.env;

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// роуты без авторизации
app.post('/signin', login);
app.post('/signup', createUser);

// авторизация
app.use(auth);

// роуты с авторизацией
app.use('/', usersRoutes);
app.use('/', cardsRoutes);

app.use(/.*/, (req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

// обрабатываем ошибки
app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  return next;
});

app.listen(PORT);
