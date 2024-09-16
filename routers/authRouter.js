const express = require('express');
const { login, register, logout } = require('../controllers/authController');
const router = express.Router();

router.get('/logout', logout);

router.post('/register', register);

router.post('/login', login);

module.exports = router;