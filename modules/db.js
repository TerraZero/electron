'use strict';

const Module = SYS.use('!Module');
const Controller = SYS.use('entity/controller/Controller');

const mysql      = SYS.node('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'electron',
});

// connection.connect();

// var q = squel.insert()
//   .into('user')
//   .set('uid', 5)
//   .set('name', 'TerraZero');

// connection.query(q.toString(), function(err, rows, fields) {
//   if (err) throw err;

//   console.log(rows);
//   console.log(fields);
// });

// connection.end();

module.exports = class DB extends Module {

  createTable(controller) {
    SYS.context(this, 'createTable').checkTypes(controller, Controller);

    var query = 'CREATE TABLE ';
    var primary = [];
    var fields = controller.fields();

    query += controller.table() + '(';

    var fieldParts = [];
    for (var field in fields) {
      if (fields[field]._primary) {
        primary.push(fields[field]._name);
      }
      fieldParts.push(fields[field].build());
    }

    query += fieldParts.join(',');

    if (primary.length) {
      query += ',PRIMARY KEY (' + primary.join(',') + ')';
    }

    query += ');';

    this.execute(query);
  }

  execute(query) {
    connection.connect();

    connection.query(query, function(err, rows) {
      if (err) throw err;

      console.log(rows);
      console.log(arguments);
    });

    connection.end();
  }

};