'use strict';

/**
  * @SysRoute(
  *   value="entity",
  *   description="Loader for entities"
  * )
  * @SysRoute(
  *   value="entity.<name>",
  *   register="Entity",
  *   keys=["name"],
  *   description="Entity class for '<name>' entities",
  *   loader="entity:entity(name)"
  * )
  * @SysRoute(
  *   value="entity.<name>.controller",
  *   register="Controller",
  *   keys=["name"],
  *   description="Controller for '<name>' entities",
  *   loader="entity:controller(name)"
  * )
  */
module.exports = class EntityLoader {

  static entity(name) {
    return SYS.get('entity.' + name);
  }

  static controller(name) {
    return SYS.get('entity.' + name + '.controller');
  }

}