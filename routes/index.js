var express = require('express');
var password = require('password-hash-and-salt'); // npm install password-hash-and-salt --save
var router = express.Router();
const util = require('util');
var path = require('path');
const app = require('../app.js');

var db = require('../database');


var promisePool = db.promisePool;

var getRows = db.getRows;

var insert = db.insert;

const databaseCall = db.databaseCall;




async function getUser(username) {
  const [rows] = await connection.promise().query(
    `SELECT *
      FROM users
      WHERE username = ?`,
    [username]
  )

  return rows[0]
}


async function hashString(user_password, hash) {
    let promise = await new Promise ((resolve, reject) => {

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
    });

    return promise;
}



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


async function getHash(newPassword) {
  return new Promise((resolve, reject) => {

      password(newPassword).hash(function(error, hash) {
            if(error)
                // throw new Error('Something went wrong!');

                reject(error);
            else {
                resolve(hash);
            }
    });
  });
}


async function verify(user_password, hash) {
  return new Promise((resolve, reject) => {

      password(user_password).verifyAgainst(hash, function(error, verified) {
            if(error) {
                reject(error);
            } else {
                resolve(hash);
            }
    });
  });
}

// allows a user to sign up
router.post('/signUp', async function(req, res, next) {
    if('username' in req.body && 'password' in req.body && 'email' in req.body) {
        // var parameters = [req.body.user_name, req.body.password];
        var user_password = req.body.password;
        var verified;
        var hash;

        try {
            hash = await getHash(req.body.password);
            console.log(hash);
            console.log("here1");

            verified = await verify(user_password, hash);


            console.log("here2");

             if(verified) {

                  var query = `
                INSERT INTO Users (username, pwhash, name, emailaddress)
                VALUES (?, ?, ?, ?);
                `;

                var parameters = [req.body.username, hash, "test_name_currently_not_used", req.body.email];



                await insert(query, parameters);

                console.log("here3");


                res.redirect('/');

             } else {
                 throw err;
             }



        } catch (err) {
            res.status(400).send();
        }

    } else {
        res.status(400).send("requires user_name and password parameters in request body");
    }
});

// handles login of users
var user_id = 0; // temp until database is created
router.post('/login', async function(req, res, next) { // update to a post request for website integration when front end made

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


            let rows = await getRows(res, query, parameters);

            // retrived info from sql table
            var hash = rows[0].pwhash;

            try {
                var verified = await verify(user_password, hash);
                if(verified) {

                    req.session.user = rows[0].idUsers;
                    console.log("User id set to: " + req.session.user);
                    res.redirect('/home');

                } else {
                     console.log("Don't try! We got you!");
                    res.status(400).send("denied");

                }

            } catch (err) {
                res.sendStatus(500);
            }

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