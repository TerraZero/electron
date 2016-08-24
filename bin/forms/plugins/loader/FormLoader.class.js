'use strict';

(function registerFieldTypes() {
  var plugins = SYS.plugins('FieldType', 'bin', 'mods');

  for (var i in plugins) {
    var id = plugins[i].annotation.getDefinitions('FieldType')[0].id;
    var value = plugins[i].annotation.getDefinitions('FieldType')[0].value;
    var description = plugins[i].annotation.getDefinitions('FieldType')[0].description;

    SYS.addPlugin(id || 'form.field.' + value, {
      path: plugins[i].path,
      description: description || '[Loader]: Type definition for ' + value,
      annotation: plugins[i].annotation.getDefinitions('FieldType')[0],
    });
  }
})();

(function registerFieldTypes() {
  var plugins = SYS.plugins('Form', 'bin', 'mods');

  for (var i in plugins) {
    var id = plugins[i].annotation.getDefinitions('Form')[0].id;
    var value = plugins[i].annotation.getDefinitions('Form')[0].value;
    var description = plugins[i].annotation.getDefinitions('Form')[0].description;

    SYS.addPlugin(id || 'form.instance.' + value, {
      path: plugins[i].path,
      description: description || '[Loader]: Form class for ' + value,
      annotation: plugins[i].annotation.getDefinitions('Form')[0],
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