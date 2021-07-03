const cardsRoutes = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  createCard, getCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

cardsRoutes.get('/cards', getCard);

cardsRoutes.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),

    link: Joi.string().pattern(/http(s)?:\/\/(www\.)?[a-zA-Z0-9-._~:\/?#[\]@!$&'()*\+,;=]{2,256}\.[a-z]{2,6}([a-zA-Z0-9-._~:\/?#[\]@!$&'()*\+,;=]{1,})?/).required(),
  }),
}), createCard);

cardsRoutes.delete('/cards/:cardsId', celebrate({
  params: Joi.object().keys({

    cardsId: Joi.string().required().length(24).hex(),
  }),
}), deleteCard);

cardsRoutes.put('/cards/:cardsId/likes', celebrate({
  params: Joi.object().keys({

    cardsId: Joi.string().required().length(24).hex(),
  }),
}), likeCard);

cardsRoutes.delete('/cards/:cardsId/likes', celebrate({
  params: Joi.object().keys({
    cardsId: Joi.string().required().length(24).hex(),
  }),
}), dislikeCard);

module.exports = cardsRoutes;
