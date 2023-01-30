const router = require('express').Router();
const { createGame } = require('../controllers/games');

router.post('/game/me', createGame);

module.exports = router;