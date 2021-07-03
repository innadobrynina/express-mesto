const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');

const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');
const authRoutes = require('./routes/auth');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;
const app = express();

app.use(cookieParser());
app.use(errors());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// роуты, не требующие авторизации
app.use('/', authRoutes);

// авторизация
app.use(auth);

// роуты, для которых нужна авторизации
app.use('/users', usersRoutes);
app.use('/cards', cardsRoutes);

// централизованная обработка ошибок
app.use((err, req, res) => {
  res.status(500).send({ message: err.message });
});

app.use((req, res) => res.status(404).send({ message: 'Такой страницы не существует' }));

app.listen(PORT);
