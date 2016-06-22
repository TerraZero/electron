'use strict';

const Arrays = SYS.module('arrays');

module.exports = class Element {

  constructor() {
    this._attributes = {};
    this._tpl = null;
  }

  get tpl() {
    return this._tpl;
  }

  set tpl(template) {
    this._tpl = template;
  }

  addAttr(attr) {
    this._attributes[attr] = this._attributes[attr] || [];
    var values = SYS.args(arguments, 1);

    for (var i in values) {
      this._attributes[attr].push(values[i]);
    }
    return this;
  }

  removeAttr(attr) {
    if (!this._attributes[attr]) return this;
    var values = SYS.args(arguments, 1);

    if (values.length == 0) {
      delete this._attributes[attr];
      return this;
    }

    arrays.remove(this._attributes[attr], values);
    if (this._attributes[attr].length == 0) {
      delete this._attributes[attr];
    }
    return this;
  }

  getAttr(attr) {
    return this._attributes[attr] || null;
  }

  hasAttr(attr) {
    return this.getAttr(attr) != null;
  }

}