const express = require('express');
const router = express.Router();
const { checkUserLoggedIn } = require("../middlewares/auth.middleware.js");

router
    .get('/', checkUserLoggedIn, (req, res) => {
        res.render('home');
    })

module.exports = router;