'use strict';

(function registerFieldTypes() {
  var plugins = SYS.plugins('FieldType', 'bin', 'mods');

  for (var i in plugins) {
    var annot = plugins[i].annotation.getDefinitions('FieldType')[0];

    SYS.addPlugin(annot.id || 'form.field.' + annot.value, {
      path: plugins[i].path,
      description: annot.description || '[Loader]: Type definition for ' + annot.value,
      annotation: annot,
    });
  }
})();

(function registerForms() {
  var plugins = SYS.plugins('Form', 'bin', 'mods');

  for (var i in plugins) {
    var annot = plugins[i].annotation.getDefinitions('Form')[0];

    SYS.addPlugin(annot.id || 'form.instance.' + annot.value, {
      path: plugins[i].path,
      description: annot.description || '[Loader]: Form class for ' + annot.value,
      annotation: annot,
    });
  }
})();


/**
  * @ID(
  *   value="form",
  *   register=true,
  *   description="Loader for forms"
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