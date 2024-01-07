const express = require('express');
const auth = require('../middlewares/auth');
const titleController = require('../controllers/title');

const router = express.Router();

router.get('/:titleID', auth.authenticateuser, titleController.title);
module.exports = router;