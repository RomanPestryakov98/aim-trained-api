const router = require('express').Router();
const { createUser, login, signout } = require('../controllers/users');
const auth = require('../middlewares/auth');
const userRouter = require('./users');
const gameRouter = require('./games');
const { validationSignin, validationSignup } = require('../middlewares/validation');

router.post('/signup', validationSignup, createUser);
router.post('/signin', validationSignin, login);
router.post('/signout', signout);

router.use(gameRouter);
router.use(auth, userRouter);


module.exports = router;