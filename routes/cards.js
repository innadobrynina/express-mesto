const cardsRoutes = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  createCard, getCards, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

cardsRoutes.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required(),
  }).unknown(true),
}), createCard);

cardsRoutes.get('/cards', getCards);

cardsRoutes.delete('/cards/:cardsId', celebrate({
  params: Joi.object().keys({
    cardsId: Joi.string().alphanum().length(24),
  }),
  headers: Joi.object().keys({
  }).unknown(true),
}), deleteCard);

cardsRoutes.put('/cards/:cardsId/likes', celebrate({
  params: Joi.object().keys({
    cardsId: Joi.string().alphanum().length(24),
  }),
}), likeCard);

cardsRoutes.delete('/cads/:cardsId/likes', celebrate({
  params: Joi.object().keys({
    cardsId: Joi.string().alphanum().length(24),
  }),
}), dislikeCard);

module.exports = cardsRoutes;
