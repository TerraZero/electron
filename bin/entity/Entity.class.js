'use strict';

const Render = SYS.use('./render/Render');
const DB = SYS.use('db/DB');

module.exports = class Entity {

  static controller() {
    SYS.context('Entity', 'static:controller').abstract();
  }

  static multi(ids, callback) {
    this.controller().multi(ids, this, callback);
  }

  constructor(type, row = null) {
    this._type = type;
    this._fields = {};
    this._view = {};

    this.controller().create(this, row);
  }

  controller() {
    return this.constructor.controller();
  }

  load(id, callback) {
    this.controller().load(this, id, callback);
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

  save(callback) {
    this.controller().save(this, callback);
    return this;
  }

  view(mode, flush = false) {
    Render.view(this, mode, flush);
    return this;
  }

  render(mode, flush = false) {
    return Render.render(this, mode, flush);
  }

  flush() {
    this._view = {};
    return this;
  }

  data(row) {
    this.controller().data(this, row);
  }

}