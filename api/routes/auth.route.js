const express = require('express');
const router = express.Router();

const { loginBodyValidator } = require('../../validators/');
const controller = require('../controllers/auth.controller');

router.post('/signin', loginBodyValidator, controller.postSignIn);

router.post('/signup', loginBodyValidator, controller.postSignUp);

module.exports = router;