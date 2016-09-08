'use strict';

/**
  * @SysRoute(
  *   value="boot",
  *   description="Loader for base classes"
  * )
  * @SysRoute(
  *   value="base.<value>",
  *   register="Base",
  *   description="Base class to build '<value>'s",
  *   loader="boot:base(name)",
  *   keys=["value"],
  *   init=false,
  *   getter=false
  * )
  * @SysRoute(
  *   value="builder.<value>",
  *   register="Builder",
  *   description="Builder for '<value>'",
  *   loader="boot:builder(name)",
  *   keys=["value"]
  * )
  * @SysRoute(
  *   value="interface.<value>",
  *   register="Interface",
  *   description="Interface <value>",
  *   loader="boot:inter(name)",
  *   keys=["value"]
  * )
  */
module.exports = class BootLoader {

  static base(name) {
    return SYS.route('base.' + name);
  }

  static builder(name) {
    return SYS.route('builder.' + name);
  }

  static inter(name) {
    return SYS.route('inter.' + name);
  }

}