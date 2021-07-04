const { celebrate, Joi } = require('celebrate');
const mongoose = require('mongoose');

const validateUserId = celebrate({
  params: Joi.object().keys({
    userId: Joi.custom((value, helpers) => {
      if (mongoose.Types.ObjectId.isValid(value)) {
        return value;
      }
      return helpers.message('неправильный ID');
    }),
  }),
});

const validateUserInfo = celebrate({
  body: Joi.object().keys({
    name: Joi.string().max(30),
    about: Joi.string().max(30),
    avatar: Joi.string(),
  }),
});

const validateEmailAndPassword = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
});

const validateCardInfo = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required(),
  }),
});

const validateCardId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.custom((value, helpers) => {
      if (mongoose.Types.ObjectId.isValid(value)) {
        return value;
      }
      return helpers.message('неправильный ID');
    }),
  }),
});

module.exports = {
  validateUserId,
  validateUserInfo,
  validateEmailAndPassword,
  validateCardInfo,
  validateCardId,
};