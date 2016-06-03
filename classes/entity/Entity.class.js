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
    this._flush = false;

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

  view(mode, flush = false) {
    render.view(this, mode, flush || this._flush);
    this._flush = false;
    return this;
  }

  render(mode, flush = false) {
    var output = render.render(this, mode, flush || this._flush);
    this._flush = false;
    return output;
  }

  flush() {
    this._flush = true;
    return this;
  }

}