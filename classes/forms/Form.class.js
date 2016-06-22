'use strict';

const FormComponent = SYS.use('forms/FormComponent');

module.exports = class Form {

  constructor(name) {
    this._name = name;
    this._items = [];
  }

  name() {
    return this._name;
  }

  add(item) {
    SYS.context(this, 'add').checkTypes(item, FormComponent);
    this._items.push(item);
    return this;
  }

}