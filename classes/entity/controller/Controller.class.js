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
      entity._fields[field] = null;

      if (!fields[field]._private) {
        Object.defineProperty(entity, field, {
          set: Controller.fieldSetter(entity, field),
          get: Controller.fieldGetter(entity, field),
        });
      }
    }

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