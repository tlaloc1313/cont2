var express = require('express');
var router = express.Router();
const util = require('util');

var db = require('../database');


var promisePool = db.promisePool;

const databaseCall = db.databaseCall;

// // get the client
// const mysql = require('mysql2');

// // Create the connection pool. The pool-specific settings are the defaults
// const pool = mysql.createPool({
//   host: 'aajf9aopbg4qnz.cjtdffwweqyc.us-east-2.rds.amazonaws.com',
//     port: '3306',
//     database: 'ebdb',
//     user: 'cont2db',
//     password: 'ykyY1Q8vtyvJL'
// });


// async function databaseCall (res, query, parameters) {
//     try {
//         const [rows] = await promisePool.query(query, parameters);
//          res.json(rows);
//     } catch (e) {
//         console.log(e);
//         if (e instanceof ER_BAD_FIELD_ERROR ) {
//             res.sendStatus(400);
//         } else {
//             res.sendStatus(500);
//         }
//     }
// }

/* GET tasks */
// router.get('/', function(req, res, next) {
router.get('/', async (req, res) => {

    // app.post('/users', async (req, res)

    var parameters = [req.session.user];
    var query = `
    SELECT * FROM Tasks
    Where idUsers=?;
    `;

    // //Connect to the database
    // req.pool.getConnection(function (err, connection) {
    //     if (err) {
    //         res.sendStatus(500);
    //         return;
    //     }

    //     connection.query(query, parameters, function (err, rows, fields) {
    //         connection.release(); // release connection
    //         if (err) {
    //             res.sendStatus(400);
    //             return;
    //         }


    //         res.json(rows);

    //     });
    // });

    //  const rows = await req.pool.getTasks(req.session.user);

//     // get the client
//   const mysql = require('mysql2/promise');
//   // create the connection
//   const connection = await mysql.createConnection({host:'localhost', user: 'root', database: 'test'});
//   // query database
//   const [rows, fields] = await connection.execute('SELECT * FROM `table` WHERE `name` = ? AND `age` > ?', ['Morty', 14]);

//   const connection = await mysql2.createConnection(req.pool);


     // now get a Promise wrapped instance of that pool
//   const promisePool = pool.promise();
  // query database using promises


    //   var rows;

    // pool.promise().query(query, parameters)
    //     .then(([rows,fields]) => {
    //             console.log(rows);
    //             var rows = this.rows;
    //     })
    //     .catch(
    //         // console.log("error");
    //         res.sendStatus(400);
    //     );

    // try {
    //     const [rows] = await promisePool.query(query, parameters);
    //      res.json(rows);
    // } catch (e) {
    //     console.log(e);
    //     if (e instanceof ER_BAD_FIELD_ERROR ) {
    //         res.sendStatus(400);
    //     } else {
    //         res.sendStatus(500);
    //     }
    // }


     databaseCall(res, query, parameters);

});


router.post('/delete', function(req, res, next) {
    if ('taskId' in req.body) {
        var parameters = [req.body.taskId, req.session.user];
        // ============= security issue anyone can delete a task
        var query = `
        DELETE FROM Tasks
        WHERE idTasks=? AND idUsers=?;
        `;

        databaseCall(res, query, parameters);

        // //Connect to the database
        // req.pool.getConnection(function (err, connection) {
        //     if (err) {
        //         res.sendStatus(500);
        //         return;
        //     }

        //     connection.query(query, parameters, function (err, rows, fields) {
        //         connection.release(); // release connection
        //         if (err) {
        //             res.sendStatus(400);
        //             return;
        //         }

        //         res.sendStatus(200);
        //     });
        // });



    } else {
        res.status(400).send("requires a task id");
    }

});


router.post('/create', function(req,res,next) {
    if ('title' in req.body && 'description' in req.body && 'date' in req.body && 'priority' in req.body) {
        var parameters = [req.body.title, req.body.description, req.session.user, req.body.date, req.body.priority];

        var query = `
        INSERT INTO Tasks (title, description, idUsers, date, priority, filepath)
        VALUES (?, ?, ?, ?, ?, NULL);
        `;

        // //Connect to the database
        // req.pool.getConnection(function (err, connection) {
        //     if (err) {
        //         res.sendStatus(500);
        //         return;
        //     }

        //     connection.query(query, parameters, function (err, rows, fields) {
        //         connection.release(); // release connection
        //         if (err) {
        //             res.sendStatus(400);
        //             return;
        //         }

        //         // res.sendStatus(200);
        //         res.redirect('/home');

        //     });
        // });

         databaseCall(res, query, parameters);
    } else {
        res.status(400).send("check inputs in req.body");
    }
});

router.post('/modify', function(res, req, next) {
    if ('title' in req.body && 'description' in req.body && 'taskId' in req.body &&
    'date' in req.body && 'priority' in req.body) {
        var parameters = [req.body.title, req.body.description, req.session.user, req.body.taskId, req.body.date, req.body.priority];

        var query = `
        UPDATE
            Tasks
        SET
            title = ?,
            date = ?,
            priority = ?,
            filepath = ?,
            description = ?
        WHERE
            idUsers = ?
            AND taskId = ?
        `;

        // //Connect to the database
        // req.pool.getConnection(function (err, connection) {
        //     if (err) {
        //         res.sendStatus(500);
        //         return;
        //     }

        //     connection.query(query, parameters, function (err, rows, fields) {
        //         connection.release(); // release connection
        //         if (err) {
        //             res.sendStatus(400);
        //             return;
        //         }

        //         res.sendStatus(200);
        //     });
        // });

         databaseCall(res, query, parameters);

    } else {
        res.status(400).send("check inputs in req.body");
    }
});



module.exports = router;