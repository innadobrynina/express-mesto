const Card = require('../models/card');

// создание карточки
module.exports.createCard = (req, res) => {
  const { name, link } = req.params;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

// возвращаем все карточки
module.exports.getCards = (req, res) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

// удаляем карточку
module.exports.deleteCard = (req, res) => {
  if (req.params.cardsId.length !== 24) {
    res.status(400).send({ message: 'Переданы некорректные данные ' });
  } else {
    Card.findById(req.params.cardsId)
      .then((card) => {
        if (card === null) {
          res.status(404).send({ message: 'Запрашиваемая карточка не найдена' });
        } else {
          Card.findByIdAndRemove(req.params.cardsId)
            .then(res.send({ message: 'card deleted' }));
        }
      })
      .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
  }
};

// ставим лайк
module.exports.likeCard = (req, res) => {
  if (req.params.cardsId.length !== 24) {
    res.status(400).send({ message: 'Переданы некорректные данные' });
  } else {
    Card.findById(req.params.cardsId)
      .then((card) => {
        if (card === null) {
          res.status(404).send({ message: 'Запрашиваемая карточка не найдена' });
        } else {
          Card.findByIdAndUpdate(
            req.params.cardsId,
            { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
            { new: true, runValidators: true },
          )
            .then(() => res.send({ card }))
            .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
        }
      });
  }
};

// снимаем лайк
module.exports.dislikeCard = (req, res) => {
  if (req.params.cardsId.length !== 24) {
    res.status(400).send({ message: 'Переданы некорректные данные' });
  } else {
    Card.findById(req.params.cardsId)
      .then((card) => {
        if (card === null) {
          res.status(404).send({ message: 'Запрашиваемая карточка не найдена' });
        } else {
          Card.findByIdAndUpdate(
            req.params.cardsId,
            { $pull: { likes: req.user._id } }, // убрать _id из массива
            { new: true },
          )
            .then(() => res.send({ card }))
            .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
        }
      });
  }
};
