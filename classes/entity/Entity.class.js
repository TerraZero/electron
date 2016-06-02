'use strict';

const render = SYS.module('render');

module.exports = class Entity {

  static controller() {
    return null;
  }

  constructor(type) {
    this._type = type;
    this._id = null;
    this._fields = {};
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

  isSave() {
    return this._id != null;
  }

  view(mode) {
    return render.view(this, mode);
  }

}