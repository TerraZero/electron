'use strict';

let _instance = null;

module.exports = class Controller {

  static instance() {
    if (_instance == null) {
      _instance = new Controller();
    }
    return _instance;
  }

  static fieldGetter(entity, name) {
    return function() {
      return entity._fields[name];
    };
  }

  static fieldSetter(entity, name) {
    return function(value) {
      entity._fields[name] = value;
    };
  }

  constructor() {
    this._table = null;
    this._fields = {};
    this._extensible = false;

    this.instanceInfo();
  }

  isExtensible() {
    return this._extensible;
  }

  fields() {
    return this._fields;
  }

  table() {
    return this._table;
  }

  instanceInfo() {
    SYS.context(this, 'instanceInfo').abstract();
  }

  create(entity) {
    var fields = this.fields();

    for (var field in fields) {
      // create default value for the field
      if (typeof fields[field]._value == 'function') {
        entity._fields[field] = fields[field]._value(entity);
      } else {
        entity._fields[field] = fields[field]._value;
      }

      // create public properties for the field
      var handler = fields[field]._handler;
      if (handler) {
        Object.defineProperty(entity, field, handler(entity, field));
      }
    }

    // make the object not writable
    if (!this.isExtensible()) {
      Object.preventExtensions(entity);
    }
  }

  save(entity) {
    if (entity.id() == null) {
      this.insert(entity);
    } else {
      this.update(entity);
    }
  }

  insert(entity) {
    SYS.context(this, 'insert').abstract();
  }

  update(entity) {
    SYS.context(this, 'update').abstract();
  }

}