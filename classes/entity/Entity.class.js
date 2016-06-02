'use strict';

const render = SYS.module('render');

module.exports = class Entity {

  static controller() {
    SYS.context('Entity', 'controller').abstract();
  }

  constructor(type) {
    this._type = type;
    this._id = null;
    this._fields = {};
    this.constructor.controller().create(this);
  }

  controller() {
    return this.constructor.controller();
  }

  type() {
    return this._type;
  }

  id() {
    return this._id;
  }

  fields() {
    return this._fields;
  }

  field(name, value) {
    if (value != undefined) {
      this._fields[name] = value;
    }
    return this._fields[name];
  }

  save() {
    this.controller().save(this);
    return this;
  }

  view(mode) {
    return render.view(this, mode);
  }

}