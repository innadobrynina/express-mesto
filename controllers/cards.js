const Card = require('../models/card');

// создание карточки
module.exports.createCard = (req, res) => {
  const { name, link } = req.params;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.send(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка на сервере' });
      }
    });
};

// возвращаем все карточки
module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(201).send(cards))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка  на сервере' }));
};

// удаляем карточку
module.exports.deleteCard = (req, res) => {
  const owner = req.user._id;
  Card.find(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Карточки с таким Id нет' });
      } else if (owner === card.owner.toString()) {
        Card.findByIdAndDelete(req.params.cardId)
          .then(() => res.status(200).send({ message: 'Карточка удалена' }))
          .catch(() => res.status(500).send({ message: 'Произошла ошибка  на сервере' }));
      }
      return res.status(403).send({ message: 'Удалить можно только свою карточку' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(500).send({ message: 'Произошла ошибка  на сервере' });
    });
};

// ставим лайк
module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardsId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true, select: 'likes' },
  )
    .then((likes) => {
      if (!likes) {
        return res.status(404).send({ message: 'Карточки с таким Id нет' });
      }
      return res.status(200).send(likes);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(500).send({ message: 'Произошла ошибка  на сервере' });
    });
};

// снимаем лайк
module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true, select: 'likes' },
  )
    .then((likes) => {
      if (!likes) {
        return res.status(404).send({ message: 'Карточки с таким Id нет' });
      }
      return res.status(200).send(likes);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(500).send({ message: 'Произошла ошибка  на сервере' });
    });
};
