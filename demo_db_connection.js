var mysql = require('mysql2');

let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'api_test_01'
});

connection.connect(function(err) {
  if (err) {
    return console.error('error: ' + err.message);
  }

  console.log('Connected to the MySQL server.');

   let createTodos = `create table if not exists todos(
                            id int primary key auto_increment,
                            title varchar(255)not null,
                            completed tinyint(1) not null default 0
                        )`;

    connection.query(createTodos, function(err, results, fields) {
      if (err) {
        console.log(err.message);
      }
      console.log('Table created')
    });



});