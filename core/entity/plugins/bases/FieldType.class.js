'use strict';

/**
  * @Base("FieldType")
  * @SysRoute(
  *   value="entity.field.<value>",
  *   register="FieldType",
  *   keys=["value"],
  *   description="FieldType class for '<value>' fields",
  *   loader="base.entityfield:field(value)",
  *   dir="fieldtypes"
  * )
  */
module.exports = class FieldType {

  static type(value) {
    return use('entity.field.' + value);
  }

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
    throw err('AbstractError', this, 'definition');
  }

}