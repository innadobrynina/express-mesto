const express = require('express');

const mongoose = require('mongoose');
const userRoutes = require('./routes/users');

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use((req, res, next) => {
  req.user = {
    _id: '60c90f7e9b1bb550500d1bad',
  };

  next();
});

app.use('/', userRoutes);

app.listen(PORT);
