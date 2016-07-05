'use strict';

const Element = SYS.use('io/Element');
const FormComponent = SYS.use('forms/FormComponent');

module.exports = class Form extends Element {

  constructor(name) {
    super()
    this.tpl('forms/form').name(name).tag('form');
  }

  name(name) {
    return this.setgetAttr('name', name);
  }

  add(item) {
    SYS.context(this, 'add').checkTypes(item, FormComponent);
    this._items.push(item);
    return this;
  }

  addChild(child) {
    SYS.context(this, 'addChild').checkTypes(child, FormComponent);
    return super.addChild(child);
  }

}