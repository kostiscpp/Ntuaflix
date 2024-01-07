const express = require('express');
const auth = require('../middlewares/auth.js');
const adminController = require('../controllers/admin.js');
const { pool } = require('../utils/database');
const router = express.Router();

router.get('/healthcheck', auth.authenticateadmin, adminController.healthcheck);
router.post('/upload/titlebasics', auth.authenticateadmin, adminController.uploadTitleBasics);
router.post('/upload/titleakas', auth.authenticateadmin, adminController.uploadTitleAkas);
router.post('/upload/namebasics', auth.authenticateadmin, adminController.uploadNameBasics);
router.post('/upload/titlecrew', auth.authenticateadmin, adminController.uploadTitleCrew);
router.post('/upload/titleepisode', auth.authenticateadmin, adminController.uploadTitleEpisode);
router.post('/upload/titleprincipals', auth.authenticateadmin, adminController.uploadTitlePrincipals);
router.post('/upload/titleratings', auth.authenticateadmin, adminController.uploadTitleRatings);
router.post('/resetall', auth.authenticateadmin, adminController.resetall);
router.post('/usermod/:username/:password', auth.authenticateadmin, adminController.usermod);
router.get('/users/:username', auth.authenticateadmin, adminController.users);
module.exports = router;