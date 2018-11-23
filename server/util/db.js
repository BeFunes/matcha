const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'matcha',
    password: 'Apple123'
});

module.exports = pool.promise();