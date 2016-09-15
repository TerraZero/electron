'use strict'

module.exports = class WrapperError extends SYS.getError('SysError') {

  create(message, error) {
    super.create(message || error.type() + ': ' + error.message);
    this._error = error;
  }

  error() {
    return this._error;
  }

}
