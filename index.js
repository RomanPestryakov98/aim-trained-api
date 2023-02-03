const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const router = require('./routes/index');
const errorHandler = require('./middlewares/errorHandler');
const { errors } = require('celebrate');
const helmet = require('helmet');
const allowedCors = require('./cors/allowedCors');
const cookieParser = require('cookie-parser');

const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

mongoose.set('strictQuery', false);

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  const { origin } = req.headers;
  res.header('Access-Control-Allow-Credentials', true);
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  next();
});

app.use((req, res, next) => {
  const { method } = req;
  const requestHeaders = req.headers['access-control-request-headers'];
  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    res.end();
  }

  next();
});

mongoose.connect('mongodb://127.0.0.1/aim-trained', {
  useNewUrlParser: true,
});

app.use(cookieParser());
app.use(helmet());

app.use('/', router);

app.use(errors());
app.use(errorHandler);

app.listen(3000, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port 3000`)
})

