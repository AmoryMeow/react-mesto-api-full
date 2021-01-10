const userModel = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');

const getUser = (req, res) => {
  userModel.find({})
    .then((data) => res.status(200).send(data))
    .catch((err) => res.status(500).send({ message: `Ошибка сервера ${err}` }));
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
      }
      else {
        throw new Error('На сервере произошла ошибка');
      }
    })
    .catch(next);
};

const createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;
  bcrypt.hash(password,10)
  .then(hash => userModel.create({
    name:name,
    about:about,
    avatar: avatar,
    email: email,
    password: hash
  }))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(500).send({ message: `Ошибка сервера ${err}` });
      }
    });
};

const updateUser = (req, res) => {
  const id = req.user._id;
  const { name, about } = req.body;
  userModel.findByIdAndUpdate(id, { name, about }, { new: true })
    .orFail(() => {
      const error = new Error('Данные не найдены');
      error.statusCode = 404;
      throw error;
    })
    .then((data) => res.status(200).send(data))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else if (err.kind === 'ObjectId' || err.kind === 'CastError') {
        res.status(400).send({ message: 'Ошибка получения данных' });
      } else if (err.statusCode === 404) {
        res.status(404).send({ message: err.message });
      } else {
        res.status(500).send({ message: `Ошибка сервера ${err}` });
      }
    });
};

const updateAvatar = (req, res) => {
  const id = req.user._id;
  const { avatar } = req.body;
  userModel.findByIdAndUpdate(id, { avatar }, { new: true })
    .orFail(() => {
      const error = new Error('Данные не найдены');
      error.statusCode = 404;
      throw error;
    })
    .then((data) => res.status(200).send(data))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else if (err.kind === 'ObjectId' || err.kind === 'CastError') {
        res.status(400).send({ message: 'Ошибка получения данных' });
      } else if (err.statusCode === 404) {
        res.status(404).send({ message: err.message });
      } else {
        res.status(500).send({ message: `Ошибка сервера ${err}` });
      }
    });
};

const login = (req, res, next) => {
  const {email, password} = req.body;

  return userModel.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key');
      res.send({ token });
    })
    .catch((err) => {
      next(err)
    });
}

module.exports = {
  getUser, getUserById, createUser, updateUser, updateAvatar, login,
};
