'use strict';

const FormContainer = SYS.use('bin/forms/FormContainer.class');

module.exports = class Form extends FormContainer {

  constructor(id) {
    super();
    this._id = id;
  }

  id(id) {
    return SETGET(this, id, '_id');
  }

}