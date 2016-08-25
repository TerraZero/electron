'use strict';

const mysql = SYS.use('mysql.node');

/**
  * @ID(
  *   value="database.connection",
  *   description="Build mysql connection",
  *   params={
  *     connection:{type: "string", value: "default"}
  *   }
  * )
  */
module.exports = class Connection {

  static initPlugin() {
    this.connections = {};
  }

  static getPlugin(connection = 'default') {
    if (!this.connections[connection]) {
      this.connections[connection] = new Connection(connection);
    }
    return this.connections[connection];
  }

  constructor(connection) {
    this._connection = mysql.createConnection({
      host     : 'localhost',
      user     : 'root',
      password : 'root',
      database : 'electron',
    });
    this._connection.connect();
  }

  createTable(controller) {
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
    return this;
  }

  execute(query, callback) {
    this._connection.query(query, callback);
    return this;
  }

  end() {
    this._connection.end();
    return this;
  }

};