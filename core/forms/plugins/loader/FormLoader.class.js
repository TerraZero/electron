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
  *   loader="form:form(name)",
  *   dir="forms"
  * )
  * @SysRoute(
  *   value="form.field.<value>",
  *   register="FormField",
  *   keys=["value"],
  *   loader="form:field(name)",
  *   dir="formfields"
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