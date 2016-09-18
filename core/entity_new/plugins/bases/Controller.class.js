'use strict';

/**
  * @Base("Controller_new")
  */
module.exports = class Controller {

  static getRoute(sysroute) {
    if (!this._instance) this._instance = new this();
    return this._instance;
  }

  create(entity) {
    var fields = entity.fields();

    for (var i in fields) {
      var field = fields[i];

      entity._data[field.field()] = field.data();
      Object.defineProperty(entity, field.field(), {
        get: function() {
          return entity._data[field.field()];
        },
        set: function(value) {
          entity._data[field.field()] = value;
        },
      });
    }
  }

  init(entity, data) {

  }

  save(entities = []) {

  }

  load(type, ids = []) {

  }

  loadCondition(type, conditions) {

  }

}