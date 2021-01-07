// временная авторизация. добавляет в каждый запрос объект user
const tempAuth = (req, res, next) => {
  req.user = {
    _id: '5fdb9e826f74140b30ca1b79',
  };
  next();
};

module.exports = { tempAuth };
