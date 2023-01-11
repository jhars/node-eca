var mysql = require('mysql2');
require('dotenv').config()

let connection = mysql.createConnection({
    host: process.env.DATABASE_HOSTNAME,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE_NAME
});

connection.connect(function(err) {
    if (err) {
        return console.error('error: ' + err.message);
    }

    console.log('Connected to the MySQL server.');

    let viewTables = `SHOW TABLES;`

    connection.query(viewTables, function(err, results, fields) {
            if (err) {
                console.log(err.message);
            }
            console.log(results);
    })

    // let createTodos = `create table if not exists todos(
    //                         id int primary key auto_increment,
    //                         title varchar(255)not null,
    //                         completed tinyint(1) not null default 0
    //                     )`;
    //
    // connection.query(createTodos, function(err, results, fields) {
    //     if (err) {
    //         console.log(err.message);
    //     }
    //     console.log('Table created')
    // });


});