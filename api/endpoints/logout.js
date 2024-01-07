const express = require('express');
const logoutController = require('../controllers/logout.js');
const auth = require('../middlewares/auth');
const { pool } = require('../utils/database');
const router = express.Router();

router.get('/', auth.authenticateuser, logoutController.logout);
module.exports = router;