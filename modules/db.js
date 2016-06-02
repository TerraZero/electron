'use strict';

var mysql      = require('mysql');
var squel = SYS.module('squel');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'electron',
});

connection.connect();

var q = squel.insert()
  .into('user')
  .set('uid', 5)
  .set('name', 'TerraZero');

connection.query(q.toString(), function(err, rows, fields) {
  if (err) throw err;

  console.log(rows);
  console.log(fields);
});

connection.end();