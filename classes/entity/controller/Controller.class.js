'use strict';

let inner = null;

module.exports = class Controller {

  static instance() {
    if (inner == null) {
      inner = new Controller();
    }
    return inner;
  }

  constructor() {
    this._table = null;
    this._fields = {};

    this.instanceInfo();
  }

  fields() {
    return this._fields;
  }

  table() {
    return this._table;
  }

  instanceInfo() {
    SYS.context(this, 'instanceInfo').abstract();
  }

  create(entity) {
    var fields = this.fields();

    for (var field in fields) {
      entity._fields[field] = null;
    }
  }

  save(entity) {
    if (entity.id() == null) {
      this.insert(entity);
    } else {
      this.update(entity);
    }
  }

  insert(entity) {
    SYS.context(this, 'insert').abstract();
  }

  update(entity) {
    SYS.context(this, 'update').abstract();
  }

}