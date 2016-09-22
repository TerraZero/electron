'use strict';

const FormContainer = inc('core/forms/FormContainer.class');

/**
  * @Base("Form")
  */
module.exports = class Form extends FormContainer {

  constructor(id) {
    super();
    this._id = id;
  }

  id(id) {
    return SETGET(this, id, '_id');
  }

}