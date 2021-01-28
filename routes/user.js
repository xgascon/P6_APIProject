const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user'); /* import the codes from controllers/user */

router.post('/signup', userCtrl.signup);

router.post('/login', userCtrl.login);

module.exports = router;