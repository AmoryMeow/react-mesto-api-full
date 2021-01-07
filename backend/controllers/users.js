const userModel = require('../models/user');

const getUser = (req, res) => {
  userModel.find({})
    .then((data) => res.status(200).send(data))
    .catch((err) => res.status(500).send({ message: `Ошибка сервера ${err}` }));
};

const getUserById = (req, res) => {
  const { userId } = req.params;
  userModel.findById(userId)
    .orFail(() => {
      const error = new Error('Данные не найдены');
      error.statusCode = 404;
      throw error;
    })
    .then((data) => res.status(200).send(data))
    .catch((err) => {
      if (err.kind === 'ObjectId' || err.kind === 'CastError') {
        res.status(400).send({ message: 'Ошибка получения данных' });
      } else if (err.statusCode === 404) {
        res.status(404).send({ message: err.message });
      } else {
        res.status(500).send({ message: `Ошибка сервера ${err}` });
      }
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  userModel.create({ name, about, avatar })
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

module.exports = {
  getUser, getUserById, createUser, updateUser, updateAvatar,
};
