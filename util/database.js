const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'matchadb',
    password: '8aymdoc9'
});

module.exports = pool.promise();