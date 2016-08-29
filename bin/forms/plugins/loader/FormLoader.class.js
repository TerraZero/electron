'use strict';

/**
  * @SysRoute(
  *   value="form",
  *   description="Loader for forms"
  * )
  * @SysRoute(
  *   value="form.instance.<value>",
  *   register="Form"
  * )
  * @SysRoute(
  *   value="form.field.<value>",
  *   register="FieldType"
  * )
  */
module.exports = class FormLoader {

  static field(name) {
    return SYS.get('form.field.' + name);
  }

  static form(name) {
    return SYS.get('form.instance.' + name);
  }

}