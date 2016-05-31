'use strict';

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'cducsu',
});

connection.connect();

connection.query('SELECT s.name AS name, s.weight FROM system AS s WHERE s.weight <> 0', function(err, rows, fields) {
  if (err) throw err;

  for (var index in rows) {
    console.log(rows[index].name, rows[index].weight);
  }
});

connection.end();