'use strict';

module.exports = class RequiredFieldError extends SYS.getError('SysError') {

  create(struct, field) {
    super.create('The field "' + field + '" of class "' + struct + '" is required!');
    this._struct = struct;
    this._field = field;
    return this;
  }

  struct() {
    return this._struct;
  }

  field() {
    return this._field;
  }

}
