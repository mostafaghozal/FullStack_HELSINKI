// routes/users.js
const express = require('express');
const { createUser, getAllUsers } = require('../controllers/user');
const router = express.Router();

router.post('/', createUser);
router.get('/', getAllUsers);

module.exports = router;
