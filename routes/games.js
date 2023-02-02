const router = require('express').Router();
const auth = require('../middlewares/auth');
const { getAllGames, createGame } = require('../controllers/games');

router.get('/game/:time', getAllGames);
router.post('/game', auth, createGame);

module.exports = router;