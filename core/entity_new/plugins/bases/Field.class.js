'use strict';

/**
  * @Base("DBField")
  */
module.exports = class DBField {

  constructor(name, db, field, data = null) {
    this._name = name;
    this._db = db;
    this._field = field;
    this._data = data;
  }

  name() {
    return this._name;
  }

  db() {
    return this._db;
  }

  field() {
    return this._field;
  }

  data() {
    return this._data;
  }

  definition() {
    SYS.throw('AbstractError', 'method', 'definition', 'DBField');
  }

}