const cardsRoutes = require('express').Router();
const {
  createCard, getCards, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

cardsRoutes.post('/cards', createCard);
cardsRoutes.get('/cards', getCards);
cardsRoutes.delete('/cards/:cardsId', deleteCard);
cardsRoutes.put('/cards/:cardsId/likes', likeCard);
cardsRoutes.delete('/cads/:cardsId/likes', dislikeCard);

module.exports = cardsRoutes;
