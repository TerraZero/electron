'use strict';

/**
  * @Base("Controller")
  * @SysRoute(
  *   value="entity.controller",
  *   description="Default Controller Entity handle"
  * )
  * @SysRoute(
  *   value="entity.controller.<value>",
  *   register="Controller",
  *   keys=["value"],
  *   description="Controller for '<value>' entities",
  *   loader="base.controller:controller(value)",
  *   dir="controllers"
  * )
  */
module.exports = class Controller {

  static initRoute(sysroute) {
    this._instance = new this();
  }

  static getRoute(sysroute) {
    return this._instance;
  }

  static controller(value) {
    return use('entity.controller.' + value);
  }

  create(entity) {
    let fields = entity.fields();

    for (let i in fields) {
      let field = fields[i];

      entity._data[field.field()] = field.data();
      Object.defineProperty(entity, field.field(), field.handler(entity));
    }
  }

  init(entity, data) {
    let fields = entity.fields();

    for (let i in fields) {
      if (data[fields[i].field()] !== undefined) {
        entity[fields[i].field()] = data[fields[i].field()];
      }
    }
  }

  save(entities = []) {

  }

  load(type, ids = []) {

  }

  loadCondition(type, conditions) {

  }

}