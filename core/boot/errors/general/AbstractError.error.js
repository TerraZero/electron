'use strict';

module.exports = class AbstractError extends SYS.getError('SysError') {

  create(category, name, struct) {
    var message = '';
    this._category = category;
    this._name = name;
    this._struct = struct;

    if (this.isStatic()) {
      message = 'The static ' + category + ' "' + name + '" of class "' + this.structname() + '" is abstract and not implemented!';
    } else {
      message = 'The ' + category + ' "' + name + '" of class "' + this.structname() + '" is abstract and not implemented!';
    }
    super.create(message);
    return this;
  }

  struct() {
    return this._struct;
  }

  structname() {
    if (this.isStatic) {
      return this._struct;
    } else {
      return this._struct.constructor.name;
    }
  }

  isStatic() {
    return typeof this._struct == 'string';
  }

  category() {
    return this._category;
  }

  name() {
    return this._name;
  }

}
