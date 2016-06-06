'use strict';

const render = SYS.module('render');
const DB = SYS.module('db');
const EntitySource = SYS.use('stream/source/EntitySource');

module.exports = class Entity {

  static controller() {
    SYS.context('Entity', 'static:controller').abstract();
  }

  static multi(ids, callback) {
    DB.execute('SELECT * FROM ' + this.controller().table() + ' t WHERE t.id in (' + ids.join(',') + ')', callback);
  }

  static source(ids) {
    return new EntitySource(this, ids);
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

  load(id) {
    this.controller().load(this, id);
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

  data(row) {
    this.controller().data(this, row);
  }

}