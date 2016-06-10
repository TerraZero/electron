'use strict';

const FormItem = SYS.use('forms/FormItem');

module.exports = class Form {

  constructor(name) {
    this._name = name;
    this._items = [];
  }

  name() {
    return this._name;
  }

  add(item) {
    SYS.context(this, 'add').checkTypes(item, FormItem);

  }

}