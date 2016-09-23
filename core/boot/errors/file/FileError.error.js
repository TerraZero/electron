'use strict';

const SysError = SYS.getError('SysError');

module.exports = class FileError extends SysError {

  define() {
    return [
      'message',
      'file',
    ];
  }

  fileString() {
    return this.args('file').resolveSub();
  }

}
