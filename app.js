const express = require('express');
const mongoose = require('mongoose');
const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const { PORT = 3000 } = process.env;
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '60c90f7e9b1bb550500d1bad',
  };

  next();
});

app.use('/', usersRoutes);
app.use('/', cardsRoutes);

app.get(/.*/, (req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});
app.post(/.*/, (req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

app.listen(PORT);
