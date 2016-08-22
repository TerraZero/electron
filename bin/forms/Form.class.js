'use strict';

const FormContainer = SYS.use('./FormContainer.class');

const types = (function formLoadTypes() {
  var loaded = SYS.plugins('FieldType', 'bin', 'mods');
  var result = {};

  for (var i in loaded) {
    result[loaded[i].annotation.getDefinitions('FieldType')[0].value] = SYS.use(loaded[i].path);
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