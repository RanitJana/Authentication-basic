const path = require('path');
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');

//initial setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, "/views"))
app.use(express.static(path.join(__dirname, '/public')));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

//routing
const register = require('./routes/register.route.js');
const login = require('./routes/login.route.js');
const home = require('./routes/home.route.js');
const logOut = require('./routes/logout.route.js');

app.use('/register', register);
app.use('/login', login);
app.use('/', home);
app.use('/logOut', logOut);


module.exports = app;