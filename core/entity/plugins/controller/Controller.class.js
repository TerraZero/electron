'use strict';

/**
  * @SysRoute(
  *   value="base.controller",
  *   description="Base Controller class for extend or loading",
  *   init=false,
  *   getter=false
  * )
  * @SysRoute(
  *   value="entity.controller",
  *   description="Default Controller Entity handle"
  * )
  * @SysRoute(
  *   value="entity.controller.<name>",
  *   register="Controller",
  *   keys=["name"],
  *   description="Controller for '<name>' entities",
  *   loader="base.controller:controller(name)"
  * )
  */
module.exports = class Controller {

  static initRoute(sysroute) {
    this._instance = new this();
  }

  static getRoute(sysroute) {
    return this._instance;
  }

  static controller(name) {
    return SYS.route('entity.controller.' + name);
  }

  create(entity) {
    var fields = entity.fields();

    for (var i in fields) {
      var field = fields[i];

      entity._data[field.field()] = field.data();
      Object.defineProperty(entity, field.field(), field.handler(entity));
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