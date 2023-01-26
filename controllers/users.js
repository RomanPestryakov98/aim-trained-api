const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFound = require('../errors/NotFound');
const BadRequest = require('../errors/BadRequest');
const Conflict = require('../errors/Conflict');
const InternalServerError = require('../errors/InternalServerError');

module.exports.login = (req, res, next) => {
  const {
    name, password,
  } = req.body;

  return User.findUserByCredentials(name, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    email, name, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email, name, password: hash,
    }))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.code === 11000) {
        if (JSON.stringify(err.keyPattern).startsWith(`{"email":`)) {
          next(new Conflict('Пользователь с такой почтой уже существует'));
        }
        else {
          next(new Conflict('Пользователь с таким логином уже существует'));
        }
      } else if (err.name === 'ValidationError') {
        next(next);
      } else {
        next(new InternalServerError());
      }
    });
};

module.exports.infoUser = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id)
    .then((user) => {
      res.send(user)
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name, password } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.findByIdAndUpdate(req.user._id, { name, password: hash }, { new: true, runValidators: true }))
    .then(user => {
      if (!user) {
        throw new NotFound('Пользователь не существует');
      }
      res.send(user)
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new Conflict('Такой email уже существует'));
        return;
      }
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные'));
        return;
      }
      next(err);
    });
};