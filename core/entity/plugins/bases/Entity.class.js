'use strict';

/**
  * @Base("Entity")
  */
module.exports = class Entity {

  static table() {
    SYS.throw('AbstractError', 'method', 'table', 'Entity');
  }

  static fields() {
    SYS.throw('AbstractError', 'method', 'fields', 'Entity');
  }

  static controller() {
    return SYS.route('entity.controller');
  }

  constructor(data = null) {
    this._data = {};
    this.controller().create(this);
    this.controller().init(this, data);
  }

  table() {
    return this.constructor.table();
  }

  fields() {
    return this.constructor.fields();
  }

  controller() {
    return this.constructor.controller();
  }

  data() {
    return this._data;
  }

  computed(mode) {
    return {};
  }

  display(mode) {
    return {
      data: this.data(),
      computed: this.computed(mode),
    };
  }

}