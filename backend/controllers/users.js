const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;
const userModel = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');

const getUser = (req, res, next) => {
  userModel.find({})
    .then((data) => res.status(200).send(data))
    .catch(next);
};

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  userModel.findById(userId)
    .then((data) => {
      if (!data) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.status(200).send(data);
    })
    .catch((err) => {
      if (err.kind === 'ObjectId' || err.kind === 'CastError') {
        throw new BadRequestError('Ошибка получения данных');
      } else if (err.statusCode === 404) {
        next(err);
      } else {
        throw new Error('На сервере произошла ошибка');
      }
    })
    .catch(next);
};

const getUserById = (req, res, next) => {
  const { userId } = req.params;
  userModel.findById(userId)
    .then((data) => {
      if (!data) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.status(200).send(data);
    })
    .catch((err) => {
      if (err.kind === 'ObjectId' || err.kind === 'CastError') {
        throw new BadRequestError('Ошибка получения данных');
      } else if (err.statusCode === 404) {
        next(err);
      } else {
        throw new Error('На сервере произошла ошибка');
      }
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => userModel.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => {
      userModel.findById(user._id)
        .then((data) => res.status(200).send(data));
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные');
      } else {
        throw new Error('На сервере произошла ошибка');
      }
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const id = req.user._id;
  const { name, about } = req.body;
  userModel.findByIdAndUpdate(id, { name, about }, { new: true })
    .then((data) => {
      if (!data) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.status(200).send(data);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else if (err.statusCode === 404) {
        next(err);
      } else if (err.kind === 'ObjectId' || err.kind === 'CastError') {
        next(new BadRequestError('Ошибка получения данных'));
      } else {
        next(err);
      }
    });
};

const updateAvatar = (req, res, next) => {
  const id = req.user._id;
  const { avatar } = req.body;
  userModel.findByIdAndUpdate(id, { avatar }, { new: true })
    .then((data) => {
      if (!data) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.status(200).send(data);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else if (err.statusCode === 404) {
        next(err);
      } else if (err.kind === 'ObjectId' || err.kind === 'CastError') {
        next(new BadRequestError('Ошибка получения данных'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return userModel.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
      res.send({ token });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getUser, getUserById, getCurrentUser, createUser, updateUser, updateAvatar, login,
};
