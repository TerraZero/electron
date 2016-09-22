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
  *   getter=false,
  *   dir="bases"
  * )
  * @SysRoute(
  *   value="builder.<value>",
  *   register="Builder",
  *   description="Builder for '<value>'",
  *   loader="boot:builder(name)",
  *   keys=["value"],
  *   dir="builders"
  * )
  * @SysRoute(
  *   value="interface.<value>",
  *   register="Interface",
  *   description="Interface <value>",
  *   loader="boot:inter(name)",
  *   keys=["value"],
  *   dir="interfaces"
  * )
  */
module.exports = class BootLoader {

  static base(name) {
    return use('base.' + name);
  }

  static builder(name) {
    return use('builder.' + name);
  }

  static inter(name) {
    return use('inter.' + name);
  }

}