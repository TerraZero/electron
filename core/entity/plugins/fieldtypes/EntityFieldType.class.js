'use strict';

const FieldType = SYS.route('base.fieldtype');

/**
  * @FieldType("Entity")
  * @TODO
  */
module.exports = class EntityFieldType extends FieldType {

  constructor(name, db, field, type) {
    this._name = name;
    this._db = db;
    this._field = field;
    this._data = null;
    this._type = type;
  }

  type() {
    return this._type;
  }

}