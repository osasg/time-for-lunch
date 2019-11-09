const express = require('express');
const router = express.Router();

const controller = require('../controllers/auth.controller');

router.post('/signin', controller.postSignIn);

router.post('/signup', controller.postSignUp);

module.exports = router;