const cardModel = require('../models/card');

const getCards = (req, res) => {
  cardModel.find({})
    .then((data) => res.status(200).send(data))
    .catch((err) => res.status(500).send({ message: `Ошибка сервера ${err}` }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  cardModel.create({ name, link, owner })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(500).send({ message: `Ошибка сервера ${err}` });
      }
    });
};

const deleteCardById = (req, res) => {
  const { cardId } = req.params;
  cardModel.findByIdAndRemove(cardId)
    .orFail(() => {
      const error = new Error('Данные не найдены');
      error.statusCode = 404;
      throw error;
    })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.kind === 'ObjectId' || err.kind === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else if (err.statusCode === 404) {
        res.status(404).send({ message: err.message });
      } else {
        res.status(500).send({ message: `Ошибка сервера ${err}` });
      }
    });
};

const likeCard = (req, res) => {
  const userId = req.user._id;
  const { cardId } = req.params;

  cardModel.findByIdAndUpdate(cardId,
    { $addToSet: { likes: userId } },
    { new: true })
    .orFail(() => {
      const error = new Error('Данные не найдены');
      error.statusCode = 404;
      throw error;
    })
    .then((data) => res.status(200).send(data))
    .catch((err) => {
      if (err.kind === 'ObjectId' || err.kind === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else if (err.statusCode === 404) {
        res.status(404).send({ message: err.message });
      } else {
        res.status(500).send({ message: `Ошибка сервера ${err}` });
      }
    });
};

const dislikeCard = (req, res) => {
  const userId = req.user._id;
  const { cardId } = req.params;

  cardModel.findByIdAndUpdate(cardId,
    { $pull: { likes: userId } },
    { new: true })
    .orFail(() => {
      const error = new Error('Данные не найдены');
      error.statusCode = 404;
      throw error;
    })
    .then((data) => res.status(200).send(data))
    .catch((err) => {
      if (err.kind === 'ObjectId' || err.kind === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else if (err.statusCode === 404) {
        res.status(404).send({ message: err.message });
      } else {
        res.status(500).send({ message: `Ошибка сервера ${err}` });
      }
    });
};

module.exports = {
  getCards, createCard, deleteCardById, likeCard, dislikeCard,
};
