'use strict';

const render = SYS.module('render');

module.exports = class Entity {

  static controller() {
    SYS.context('Entity', 'static:controller').abstract();
  }

  constructor(type) {
    this._type = type;
    this._fields = {};
    this._view = {};

    this.controller().create(this);
  }

  controller() {
    return this.constructor.controller();
  }

  type() {
    return this._type;
  }

  unique() {
    return this.id;
  }

  fields() {
    return this._fields;
  }

  save() {
    this.controller().save(this);
    return this;
  }

  view(mode) {
    return render.view(this, mode);
  }

  render(mode) {
    return render.render(this, mode);
  }

}