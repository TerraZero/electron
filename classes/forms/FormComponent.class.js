'use strict';

module.exports = class FormComponent {

  constructor(name) {
    this._name = name;
    this._items = [];
  }

  name() {
    return this._name;
  }

}