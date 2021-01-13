const { celebrate, Joi } = require('celebrate');

const checkUserId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
});

const checkUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
});

const checkUpdateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string(),
  })
})

module.exports = { checkUserId, checkUpdateUser, checkUpdateAvatar }