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

  info() {
    SYS.context(this, 'info').abstract();
  }

  save(entity) {
    SYS.context(this, 'save').abstract();
  }

}