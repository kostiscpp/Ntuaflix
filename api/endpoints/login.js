const express = require('express');
const loginController = require('../controllers/login.js');
const { pool } = require('../utils/database.js');
const router = express.Router();

router.post('/', loginController.login);
module.exports = router;