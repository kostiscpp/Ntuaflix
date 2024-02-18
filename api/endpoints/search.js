const express = require('express');
const auth = require('../middlewares/auth.js');
const search = require('../controllers/search.js');

const router = express.Router();

router.get('/searchtitle', auth.authenticateuser, search.searchTitle);
router.get('/bygenre', auth.authenticateuser, search.byGenre);
router.get('/searchname', auth.authenticateuser, search.searchName);
module.exports = router;