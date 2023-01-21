const router = require('express').Router();
const { createUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');
const userRouter = require('./users');
const { validationSignin, validationSignup } = require('../middlewares/validation');

router.post('/signup', validationSignup, createUser);
router.post('/signin', validationSignin, login);

router.use(auth, userRouter);

module.exports = router;