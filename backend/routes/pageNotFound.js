const NotFoundError = require('../errors/not-found-err');

const pageNotFound = () => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
};

module.exports = pageNotFound;
