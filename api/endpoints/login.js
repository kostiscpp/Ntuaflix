const express = require('express');
const loginController = require('../controllers/login.js');
const { pool } = require('../utils/database');
const router = express.Router();

router.get('/', loginController.login);
module.exports = router;