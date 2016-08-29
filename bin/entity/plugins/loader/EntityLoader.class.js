'use strict';

/**
  * @SysRoute(
  *   value="entity",
  *   description="Loader for entities"
  * )
  * @SysRoute(
  *   value="entity.<name>",
  *   register="Entity",
  *   description="Entity class for '<name>' entities"
  * )
  * @SysRoute(
  *   value="entity.<name>.controller",
  *   register="Controller",
  *   description="Controller for '<name>' entities"
  * )
  */
module.exports = class EntityLoader {

  static controller(name) {
    return SYS.get('entity.' + name + '.controller');
  }

  static entity(name) {
    return SYS.get('entity.' + name);
  }

}