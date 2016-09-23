'use strict';

/**
  * @SysRoute(
  *   value="db",
  *   description="Database class"
  * )
  */
module.exports = class Databases {

  static initRoute() {
    this._connections = {};
  }

  static con(name = 'default') {
    if (this._connections[name] !== undefined) return this._connections[name];

    const setting = SYS.config('database:' + name);

    if (setting === undefined) {
      throw err('DBError', 'No database definition found for "' + name + '"');
    }

    const Driver = use('db.driver.' + setting.driver);

    if (Driver === null) {
      throw err('DBError', 'No database driver found for "' + name + '" with driver "' + setting.driver + '"');
    }

    this._connections[name] = new Driver(setting);
    return this._connections[name];
  }

  static end(name = null) {
    if (name === null) {
      for (var con in this._connections) {
        Databases.end(con);
      }
    } else if (this._connections[name] !== undefined) {
      this._connections[name].end();
      delete this._connections[name];
    }
  }

  static checkOptions(options) {
    if (options.offset !== undefined && options.limit === undefined) {
      options.offset = undefined;
      use('logger').warn('You need to set the "--limit" value to use the "--offset" value!');
    }
  }

}