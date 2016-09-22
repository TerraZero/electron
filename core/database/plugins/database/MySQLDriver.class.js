'use strict';

const DBDriver = SYS.route('base.dbdriver');
const mysql = SYS.node('mysql');

/**
  * @SysRoute(
  *   value="db.mysql",
  *   description="MySQL driver class"
  * )
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

  // TMP
  select() {
    return SYS.route('db.mysql.builder').select();
  }

};