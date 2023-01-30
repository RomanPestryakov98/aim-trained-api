const router = require('express').Router();
const { getAllGames, createGame } = require('../controllers/games');

router.get('/game', getAllGames);
router.post('/game', createGame);

module.exports = router;