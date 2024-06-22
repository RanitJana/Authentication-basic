const express = require('express');
const router = express.Router();
const { userRegister } = require('../controllers/user.controller.js');

router
    .get('/', (req, res) => {
        res.render('register')
    })
    .post('/', userRegister)

module.exports = router;