'use strict';

const Element = SYS.use('io/Element');

module.exports = class FormComponent extends Element {

  constructor(name) {
    super();
    this.name(name).tag('input');
  }

  type(type) {
    return this.setgetAttr('type', type);
  }

  name(name) {
    return this.setgetAttr('name', name);
  }

}