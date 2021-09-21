var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var tasksRouter = require('./routes/tasks');


var session = require('express-session');    // allow sessions

var app = express();

// Session establishing code
// npm install express-mysql-session --save
app.use(session({
    secret: 'NjhiYTE5OTYxNWE3OGIyY2Q4Yjc3YjUzM2NmNzU2ZDQyMGE0ZGM1MmEwNTZiOGFl',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));


var mysql = require('mysql');
// create a 'pool' (group) of connections to be used for connecting with our SQL server
var dbConnectionPool = mysql.createPool({
    host: 'aajf9aopbg4qnz.cjtdffwweqyc.us-east-2.rds.amazonaws.com',
    port: '3306',
    database: 'ebdb',
    user: 'cont2db',
    password: 'ykyY1Q8vtyvJL'


});

// database middleware
app.use(function(req, res, next) {
    req.pool = dbConnectionPool;
    next();

});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'), {index: 'Login.html'}));

// router extentions which are open to a user
// without a valid session token
app.use('/', indexRouter);

// session token blocking middleware
// only logged in users are allowed past this middleware
app.use(function(req, res, next) {

    // get information of user
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;

    if('user' in req.session) { // session token already held by user

        console.log("User id: " + req.session.user + "\nfullUrl: " + fullUrl);
        next();
    }
    else { // session token not held
        console.log("User without session token redirected to login" + "\nfullUrl: " + fullUrl);
        res.redirect('/');
    }

});

//========================================================================
// only users with valid session tokens can use routes past this point
//========================================================================
// app.use(express.static(path.join(__dirname, 'private')));
app.use('/users', usersRouter);
app.use('/tasks', tasksRouter);

module.exports = app;
