'use strict';

const DB = SYS.module('db');
const EntitySource = SYS.use('stream/source/EntitySource');

module.exports = class Entity {

  static controller() {
    SYS.context('Entity', 'static:controller').abstract();
  }

  static multi(ids, callback) {
    this.controller().multi(ids, callback);
  }

  static source(ids) {
    return new EntitySource(this, ids);
  }

  static save(entity, callback) {
    this.controller().save(entity, callback);
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

  data(row) {
    this.controller().data(this, row);
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

  flush() {
    this._view = {};
    return this;
  }

}