var express = require('express');
var router = express.Router();
const util = require('util');

/* GET tasks */
router.get('/', function(req, res, next) {

    var parameters = [req.session.user];
    var query = `
    SELECT * FROM Tasks
    Where idUsers=?;
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


            res.json(rows);




        });
    });

});


router.post('/delete', function(req, res, next) {
    if ('taskId' in req.body) {
        var parameters = [req.body.taskId, req.session.user];
        // ============= security issue anyone can delete a task
        var query = `
        DELETE FROM Tasks
        WHERE idTasks=? AND idUsers=?;
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

                res.sendStatus(200);
            });
        });
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

                // res.sendStatus(200);
                res.redirect('/home');

            });
        });
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

                res.sendStatus(200);
            });
        });

    } else {
        res.status(400).send("check inputs in req.body");
    }
});



module.exports = router;
