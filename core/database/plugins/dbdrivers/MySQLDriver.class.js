'use strict';

const DBDriver = SYS.route('base.dbdriver');
const mysql = SYS.node('mysql');
const DBBuilder = SYS.route('db.builder.mysql');

/**
  * @DBDriver("MySQL")
  */
module.exports = class MySQLDriver extends DBDriver {

  constructor(setting) {
    super(setting);
    this._setting = setting;

    this._connection = mysql.createConnection({
      host: setting.host,
      user: setting.user,
      password: setting.password || '',
      database: setting.database,
    });

    this.connected = false;
  }

  connect() {
    if (!this.isConnected()) {
      this._connection.connect();
      this.connected = true;
    }
  }

  isConnected() {
    return this.connected;
  }

  execute(query, callback) {
    if (!TOOLS.isString(query)) query = query.toString();
    this.connect();
    this._connection.query(query, callback);
    return this;
  }

  end() {
    if (this.isConnected()) {
      this._connection.end();
      this.connected = false;
    }
    return this;
  }

  builder() {
    return DBBuilder;
  }

  select() {
    return DBBuilder.select();
  }

  insert() {
    return DBBuilder.insert();
  }

  update() {
    return DBBuilder.update();
  }

  delete() {
    return DBBuilder.delete();
  }

};