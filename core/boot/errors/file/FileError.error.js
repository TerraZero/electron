'use strict'

module.exports = class FileError extends SYS.getError('SysError') {

  create(file, message) {
    super.create(message);
    this._file = file;
    return this;
  }

  file() {
    return this._file;
  }

}
