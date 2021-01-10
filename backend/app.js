const exspress = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { createUser, login } = require('./controllers/users');
const pageNotFound = require('./routes/pageNotFound');
const { auth } = require('./middleware/auth');

const { PORT = 3000 } = process.env;

const app = exspress();

mongoose.connect('mongodb://localhost:27017/mestodb',
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });

app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);

app.use('/', usersRouter);
app.use('/', cardsRouter);
app.use('*', pageNotFound);

app.use((err, req, res, next) => {
  const {statusCode = 500, message} = err;
  res.status(statusCode)
    .send({message:
      statusCode === 500
      ? "На сервере произошла ошибка"
      : message
    })
})

app.listen(PORT, () => {
  console.log(`Start server on port ${PORT}`);
});
