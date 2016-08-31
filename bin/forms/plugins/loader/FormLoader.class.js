'use strict';

/**
  * @SysRoute(
  *   value="form",
  *   description="Loader for forms"
  * )
  * @SysRoute(
  *   value="form.instance.<value>",
  *   register="Form",
  *   loader="form:form(name)"
  * )
  * @SysRoute(
  *   value="form.field.<value>",
  *   register="FieldType",
  *   loader="form:field(name)"
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