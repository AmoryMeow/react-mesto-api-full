const { celebrate, Joi } = require('celebrate');

const checkUserId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
});

const checkUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
});

const checkUpdateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(/https?:\/\/w{0,3}[a-z0-9-._~:\/?#[\]@!$&'()*+,;=]{0,}/i),
  }),
});

module.exports = { checkUserId, checkUpdateUser, checkUpdateAvatar };
