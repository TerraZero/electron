'use strict';

/**
  * @Base("Entity_new")
  */
module.exports = class Entity {

  static table() {
    SYS.throw('AbstractError', 'method', 'table', 'Entity');
  }

  static fields() {
    SYS.throw('AbstractError', 'method', 'fields', 'Entity');
  }

  constructor(data) {
    this._data = {};
  }

  table() {
    return this.constructor.table();
  }

  fields() {
    return this.constructor.fields();
  }

  data() {
    return this._data;
  }

}