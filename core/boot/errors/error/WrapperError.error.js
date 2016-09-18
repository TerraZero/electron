'use strict';

module.exports = class WrapperError extends SYS.getError('SysError') {

  create(message, error) {
    super.create(message || error.message);
    this.stack = error.stack;
    this._error = error;
  }

  error() {
    return this._error;
  }

}
