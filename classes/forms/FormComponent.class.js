'use strict';

const Element = SYS.use('io/Element');

module.exports = class FormComponent extends Element {

  constructor(name) {
    super();
    this._name = name;
    this._items = [];
    this.tpl = 'form/component';
  }

  name() {
    return this._name;
  }

  type() {
    SYS.context(this, 'type').abstract();
  }

}