const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');
const BadRequestError = require('../errors/BadRequestError');

// создание карточки
module.exports.createCard = (req, res, next) => {
  const { name, link, owner = req.user._id } = req.body;

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректный данные'));
      }
      next(err);
    });
};

// возвращаем все карточки
module.exports.getCard = (req, res, next) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch(next);
};

// удаляем карточку
module.exports.deleteCard = (req, res, next) => {
  Card.findById({ _id: req.params.cardId })
    .orFail(new Error('NotValidId'))
    .then((card) => {
      if (req.user._id.toString() === card.owner.toString()) {
        card.remove();
        res.status(200).send({ message: 'Карточка удалена' });
      }
      throw new ForbiddenError('Нельзя удалять чужую карточку');
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        next(new NotFoundError('Карточка с указанным _id не найдена'));
      }
      if (err.kind === 'ObjectId') {
        next(new BadRequestError('Невалидный id'));
      }
      next(err);
    });
};

// ставим лайк
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((item) => {
      if (!item) { throw new NotFoundError('Карточка по указанному id не найдена'); }
      res.send(item);
    })
    .catch((err) => {
      if (err.statusCode === 404) { next(err); }
      if (err.name === 'CastError' || err.name === 'TypeError') {
        throw new BadRequestError('Переданы некорректные данные при удалении карточки');
      }
    })
    .catch(next);
};

// снимаем лайк
module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((likes) => {
      if (!likes) { throw new NotFoundError('Карточка по указанному id не найдена'); }
      res.send(likes);
    })
    .catch((err) => {
      if (err.statusCode === 404) { next(err); }
      if (err.name === 'CastError' || err.name === 'TypeError') {
        throw new BadRequestError('Переданы некорректные данные при удалении карточки');
      }
    })
    .catch(next);
};
