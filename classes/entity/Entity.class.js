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

  isNew() {
    return this.id == null;
  }

  save() {
    this.controller().save(this);
    return this;
  }

  view(mode, flush = false) {
    render.view(this, mode, flush);
    return this;
  }

  render(mode, flush = false) {
    return render.render(this, mode, flush);
  }

  flush() {
    this._view = {};
    return this;
  }

}