const express = require('express');
const auth = require('../middlewares/auth');
const nameController = require('../controllers/name');

const router = express.Router();

router.get('/:nameID', auth.authenticateuser, nameController.name);
module.exports = router;