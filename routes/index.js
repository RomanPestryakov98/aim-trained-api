const router = require('express').Router();
const { createUser, login } = require('../controllers/users');
const { getAllGames, createGame } = require('../controllers/games');
const auth = require('../middlewares/auth');
const userRouter = require('./users');
const { validationSignin, validationSignup } = require('../middlewares/validation');

router.post('/signup', validationSignup, createUser);
router.post('/signin', validationSignin, login);

router.use(auth, userRouter);

router.get('/game/:time', getAllGames)
router.post('/game', auth, createGame);

module.exports = router;