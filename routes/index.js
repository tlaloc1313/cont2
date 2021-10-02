var express = require('express');
var password = require('password-hash-and-salt'); // npm install password-hash-and-salt --save
var router = express.Router();
const util = require('util');
var path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// allows a user to sign up
router.post('/signUp', function(req, res, next) {
    if('username' in req.body && 'password' in req.body && 'email' in req.body) {
        // var parameters = [req.body.user_name, req.body.password];
        var user_password = req.body.password;
        // // Creating hash and salt
        password(req.body.password).hash(function(error, hash) {
            if(error)
                throw new Error('Something went wrong!');

            var parameters = [req.body.username, hash, "test_name_currently_not_used", req.body.email];

            console.log(hash);

            // remove this code in final version
            password(user_password).verifyAgainst(hash, function(error, verified) {
                if(error)
                    throw new Error('Something went wrong!');
                if(!verified) {
                    console.log("Don't try! We got you!");
                } else {
                    console.log("Information verified!");
                    console.log("original password is: " + user_password);
                }
            });

            var query = `
            INSERT INTO Users (username, pwhash, name, emailaddress)
            VALUES (?, ?, ?, ?);
            `;

            //Connect to the database
            req.pool.getConnection(function (err, connection) {
                if (err) {
                    res.sendStatus(500);
                    return;
                }

                connection.query(query, parameters, function (err, rows, fields) {
                    connection.release(); // release connection
                    if (err) {
                        res.sendStatus(400);
                        console.log(err);
                        return;
                    }
                    // res.send("sign up succesful");
                    res.redirect('/');

                });
            });



        });
    } else {
        res.status(400).send("requires user_name and password parameters in request body");
    }
});

// handles login of users
var user_id = 0; // temp until database is created
router.post('/login', function(req, res, next) { // update to a post request for website integration when front end made

    // delete session token if it exists
    if('user' in req.session) { // user is logged in - requires user to logout to get a new token
         res.redirect('/'); // update to home when it is made
    } else {

        if('username' in req.body && 'password' in req.body) {
            var parameters = [req.body.username];
            var user_password = req.body.password;
            // for future implementation
            var query = `
            SELECT pwhash, idUsers FROM Users
            WHERE username=?;
            `;

            //Connect to the database
            req.pool.getConnection(function (err, connection) {
                if (err) {
                    res.sendStatus(500);
                    return;
                }

                connection.query(query, parameters, function (err, rows, fields) {
                    connection.release(); // release connection
                    if (err) {
                        res.sendStatus(400);
                        return;
                    }

                    // retrived info from sql table
                    var hash = rows[0].pwhash;
                    // time to verify information
                    password(user_password).verifyAgainst(hash, function(error, verified) {
                        if(error) {
                            throw new Error('Something went wrong!');
                            // res.sendStatus(500);
                        }
                        if(!verified) {
                            console.log("Don't try! We got you!");
                            res.status(400).send("denied");
                        } else {
                            console.log("Information verified!");
                            req.session.user = rows[0].idUsers;
                            console.log("User id set to: " + req.session.user);
                            res.redirect('/home');
                        }
                    });
                });
            });


        } else {
            res.status(400).send("requires user_name and password parameters in request body");
        }
    }
});


router.get('/home', function(req, res, next) {
    res.sendFile(path.join(__dirname, '../public/tasks.html'));
});


// remove session token on logout
router.use('/logout', function(req, res, next)
{
    // delete the session token if the user has one
    if('user' in req.session) { // session token held by user
        console.log("User id: " + req.session.user + " session token deleted");
        delete req.session.user;
    }

    res.redirect('/');
});

module.exports = router;