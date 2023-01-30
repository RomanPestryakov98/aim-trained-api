const router = require('express').Router();
const { createGame } = require('../controllers/games');

router.post('/game', createGame);

module.exports = router;