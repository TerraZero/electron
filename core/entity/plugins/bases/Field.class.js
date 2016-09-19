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

  handler(entity) {
    const field = this.field();

    return {
      get: function() {
        return entity._data[field];
      },
      set: function(value) {
        entity._data[field] = value;
      },
    };
  }

  definition() {
    SYS.throw('AbstractError', 'method', 'definition', 'DBField');
  }

}