const Game = require('../models/game');

module.exports.createGame = (req, res, next) => {
  const { time, record } = req.body;
  Game.create({ time, record, creator: req.user._id })
    .then((user) => {
      res.send(user)
    })
    .catch(next);
};
