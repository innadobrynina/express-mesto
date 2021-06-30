const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');
const BadRequestError = require('../errors/BadRequestError');

// создание карточки
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные');
      }
    })
    .catch(next);
};

// возвращаем все карточки
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch(next);
};

// удаляем карточку
module.exports.deleteCard = (req, res, next) => {
  if (req.params.cardsId.length !== 24) {
    throw new BadRequestError('Переданы некорректные данные');
  } else {
    Card.findById(req.params.cardsId)
      .then((card) => {
        if (card === null) {
          throw new NotFoundError('Запрашиваемая карточка не найдена');
        } else {
          // eslint-disable-next-line no-console
          console.log();
          if (req.user._id !== card.owner.toString()) {
            throw new ForbiddenError('Не ваша карточка');
          } else {
            Card.findByIdAndRemove(req.params.cardsId)
              .then(res.send({ message: 'card deleted' }));
          }
        }
      })
      .catch(next);
  }
};

// ставим лайк
module.exports.likeCard = (req, res, next) => {
  if (req.params.cardsId.length !== 24) {
    throw new BadRequestError('Переданы некорректные данные');
  } else {
    Card.findById(req.params.cardsId)
      .then((card) => {
        if (card === null) {
          throw new NotFoundError('Запрашиваемая карточка не найдена');
        } else {
          Card.findByIdAndUpdate(
            req.params.cardsId,
            { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
            { new: true, runValidators: true },
          )
            .then(() => res.send({ card }));
        }
      })
      .catch(next);
  }
};

// снимаем лайк
module.exports.dislikeCard = (req, res, next) => {
  if (req.params.cardsId.length !== 24) {
    throw new BadRequestError('Переданы некорректные данные');
  } else {
    Card.findById(req.params.cardsId)
      .then((card) => {
        if (card === null) {
          throw new NotFoundError('Запрашиваемая карточка не найдена');
        } else {
          Card.findByIdAndUpdate(
            req.params.cardsId,
            { $pull: { likes: req.user._id } }, // убрать _id из массива
            { new: true },
          )
            .then(() => res.send({ card }));
        }
      })
      .catch(next);
  }
};
