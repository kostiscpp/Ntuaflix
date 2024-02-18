const express = require('express');
const logoutController = require('../controllers/logout.js');
const auth = require('../middlewares/auth.js');
const { pool } = require('../utils/database.js');
const router = express.Router();

router.post('/', auth.authenticateuser, logoutController.logout);
module.exports = router;
