'use strict';

/**
  * @SysRoute(
  *   value="base",
  *   description="Loader for base classes"
  * )
  * @SysRoute(
  *   value="base.<value>",
  *   register="Base",
  *   description="Base class to build '<value>'s",
  *   loader="base:load(name)",
  *   keys=["value"],
  *   initFunction=false,
  *   getFunction=false
  * )
  */
module.exports = class BaseLoader {

  static load(name) {
    return SYS.get('bases.' + name);
  }

}