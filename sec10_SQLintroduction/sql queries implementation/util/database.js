const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'nodejs',//name used in schema in mysql application
    password: 'P@ssw0rd'
});

module.exports = pool.promise();