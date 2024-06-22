const express = require('express');
const router = express.Router();

const { checkUserLoggedIn } = require('../middlewares/auth.middleware.js');
const { userLogout } = require('../controllers/user.controller.js');

router.get('/', checkUserLoggedIn, userLogout);

module.exports = router;