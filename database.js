// var mysql2 = require('mysql2');


// var pool = mysql2.createPool({
//     host: 'aajf9aopbg4qnz.cjtdffwweqyc.us-east-2.rds.amazonaws.com',
//     port: '3306',
//     database: 'ebdb',
//     user: 'cont2db',
//     password: 'ykyY1Q8vtyvJL'
// });

// get the client
const mysql = require('mysql2');

// Create the connection pool. The pool-specific settings are the defaults
const pool = mysql.createPool({
  host: 'aajf9aopbg4qnz.cjtdffwweqyc.us-east-2.rds.amazonaws.com',
    port: '3306',
    database: 'ebdb',
    user: 'cont2db',
    password: 'ykyY1Q8vtyvJL'
});

// const pool = mysql.createPool({
//   host: 'aajf9aopbg4qnz.cjtdffwweqyc.us-east-2.rds.amazonaws.com',
//     port: '3306',
//     database: 'ebdb',
//     user: 'cont2db',
//     password: 'ykyY1dsdQ8vtyvJL'
// });

const promisePool = pool.promise();

// module.export = {
//   getConnection: () => {
//     return pool.promise();
//   }
// };


async function databaseCall (res, query, parameters) {
    try {
        const [rows] = await promisePool.query(query, parameters);
         res.json(rows);
    } catch (e) {
        console.log(e);
        if (e instanceof ER_BAD_FIELD_ERROR ) {
            res.sendStatus(400);
        } else {
            res.sendStatus(500);
        }
    }
}

async function insert(query, parameters) {
    try {
      await promisePool.query(query, parameters);
    } catch (e) {
     throw Error(error);
    }
}


async function getRows (res, query, parameters) {
    try {
        const [rows] = await promisePool.query(query, parameters);
         return rows;
    } catch (e) {
        console.log(e);
        if (e instanceof ER_BAD_FIELD_ERROR ) {
            res.sendStatus(400);
        } else {
            res.sendStatus(500);
        }
    }
}



module.exports = { promisePool, databaseCall, getRows, insert};




// exports.getConnection = () => {
//     return new Promise((resolve, reject) => {
//         pool.getConnection(function (err, connection) {
//             if (err) {
//                 return reject(err);
//             }
//             resolve(connection);
//         });
//     });
// };

// var query = `
//             INSERT INTO Users (username, pwhash, name, emailaddress)
//             VALUES (?, ?, ?, ?);
//             `;

//   var query = `
//           SELECT pwhash, idUsers FROM Users
//           WHERE username=?;
//           `;

//   var query = `
//   SELECT * FROM Tasks
//   Where idUsers=?;
//   `;

//   var query = `
//         INSERT INTO Tasks (title, description, idUsers, date, priority, filepath)
//         VALUES (?, ?, ?, ?, ?, NULL);
//         `;

//   var query = `
//       DELETE FROM Tasks
//       WHERE idTasks=? AND idUsers=?;
//       `;

//   var query = `
//         UPDATE
//             Tasks
//         SET
//             title = ?,
//             date = ?,
//             priority = ?,
//             filepath = ?,
//             description = ?
//         WHERE
//             idUsers = ?
//             AND taskId = ?
//         `;


// async function getTasks(userId) {
//     const [rows] = await connection.promise().query(
//             `SELECT * FROM Tasks
//             Where idUsers=?`,
//             [userId]

//         )
// }

// export async function getUser(username) {
//   const [rows] = await connection.promise().query(
//     `SELECT *
//       FROM users
//       WHERE username = ?`,
//     [username]
//   )

//   return rows[0]
// }

// export async function createUser(username, password) {
//   const { insertId } = await connection.promise().query(
//     `INSERT INTO users (username, password)
//       VALUES (?, ?)`,
//     [username, password]
//   )

//   return insertId
// }

// module.exports ={
//      connection : pool.createConnection(config)
// }

// module.export =  mysql2;