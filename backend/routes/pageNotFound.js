const NotFoundError = require("../errors/not-found-err");

const pageNotFound = (req, res) => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
};

module.exports = pageNotFound;
