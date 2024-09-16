const express = require('express');
const { getAllUsers, showCurrentUser, getUser, updateUser, updateUserPassword } = require('../controllers/usersController');
const router = express.Router();
const {authenticateUser, authorizePermissions} = require('../middleware/authentication');

router.get('/', authenticateUser, authorizePermissions('admin'), getAllUsers);
router.get('/showMe', authenticateUser, showCurrentUser);
router.get('/:id', authenticateUser, getUser);
router.patch('/updateUser', authenticateUser, updateUser);
router.patch('/updateUserPassword', authenticateUser, updateUserPassword);

module.exports = router;