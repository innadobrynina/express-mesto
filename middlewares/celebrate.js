const { celebrate, Joi } = require('celebrate');
const mongoose = require('mongoose');
const validator = require('validator');

const validateUserId = celebrate({
  params: Joi.object().keys({
    userId: Joi.custom((value, helpers) => {
      if (mongoose.Types.ObjectId.isValid(value)) {
        return value;
      }
      return helpers.message('Неправильный ID');
    }),
  }),
});

const customValidateURL = (value, helper) => {
  if (!validator.isURL(value, { require_protocol: true })) {
    return helper.error('Некорректный url');
  }
  return value;
};

const userInfo = {
  name: Joi.string().max(30).required(),
  about: Joi.string().max(30).required(),
};

const userAvatar = {
  avatar: Joi.string().custom(customValidateURL).required(),
};

const EmailAndPassword = {
  email: Joi.string().required().email(),
  password: Joi.string().required().min(6),
};

const validateUserInfo = celebrate({
  body: Joi.object().keys(userInfo),
});

const validateUserAvatar = celebrate({
  body: Joi.object().keys(userAvatar),
});

const validateEmailAndPassword = celebrate({
  body: Joi.object().keys(EmailAndPassword),
});

const validateRegistration = celebrate({
  body: Joi.object().keys({ ...userInfo, ...userAvatar, ...EmailAndPassword }),
});

const validateCardInfo = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom(customValidateURL),
  }),
});

const validateCardId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.custom((value, helpers) => {
      if (mongoose.Types.ObjectId.isValid(value)) {
        return value;
      }
      return helpers.message('Неправильный ID');
    }),
  }),
});

module.exports = {
  validateUserId,
  validateUserInfo,
  validateUserAvatar,
  validateEmailAndPassword,
  validateCardInfo,
  validateCardId,
  validateRegistration,
};
