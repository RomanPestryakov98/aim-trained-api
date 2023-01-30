const mongooseHidden = require('mongoose-hidden')();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Unauthorized = require('../errors/Unauthorized');
const { isEmail } = require('validator');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [isEmail],
  },
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 2,
    maxlength: 15,
  },
  password: {
    type: String,
    required: true,
    select: false,
    hide: true,
  },
});

userSchema.plugin(mongooseHidden, { hidden: { _id: false, password: true } });

userSchema.statics.findUserByCredentials = function (conditions, password) {
  return this.findOne(conditions).select('+password')
    .then((user) => {
      if (!user) {
        throw new Unauthorized('Неправильные почта или пароль');
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new Unauthorized('Неправильные почта или пароль');
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);