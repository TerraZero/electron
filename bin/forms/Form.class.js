'use strict';

const FormContainer = SYS.use('./FormContainer.class');

const types = (function formLoadTypes() {
  var plugins = SYS.plugins('FieldType', 'bin', 'mods');
  var result = {};

  for (var i in plugins) {
    result[plugins[i].annotation.getDefinitions('FieldType')[0].value] = SYS.use(plugins[i].path);
  }
  return result;
})();

module.exports = class Form extends FormContainer {

  static getStruct(type) {

  }

  constructor(id) {
    super();
    this._id = id;
  }

  id(id) {
    return SETGET(this, id, '_id');
  }

}