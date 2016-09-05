'use strict';

/**
  * @SysRoute(
  *   value="form",
  *   description="Loader for forms"
  * )
  * @SysRoute(
  *   value="form.instance.<value>",
  *   register="Form",
  *   keys=["value"],
  *   loader="form:form(name)"
  * )
  * @SysRoute(
  *   value="form.field.<value>",
  *   register="FieldType",
  *   keys=["value"],
  *   loader="form:field(name)"
  * )
  */
module.exports = class FormLoader {

  static field(name) {
    return SYS.route('form.field.' + name);
  }

  static form(name) {
    return SYS.route('form.instance.' + name);
  }

}