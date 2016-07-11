'use strict';

const mysql = SYS.use('mysql', 'node');

const Module = SYS.use('sys/Module');
const Controller = SYS.use('entity/controller/Controller');

const private = {};

module.exports = class DB extends Module {

  static build(connection = 'default') {
    if (!ISDEF(private[connection])) {
      private[connection] = new DB(connection);
    }
    return private[connection];
  }

  constructor(connection) {
    this._connection = mysql.createConnection({
      host     : 'localhost',
      user     : 'root',
      password : '',
      database : 'electron',
    });
    this._connection.connect();
  }

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

  execute(query, callback) {
    this._connection.query(query, callback);
  }

  end() {
    this._connection.end();
  }

};