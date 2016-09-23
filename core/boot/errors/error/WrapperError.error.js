'use strict';

const SysError = SYS.getError('SysError');

module.exports = class WrapperError extends SysError {

  stackIgnore() {
    return [
      'SysError.error.js:getRelevantStack',
      'SysError.error.js:SysError',
      'WrapperError.error.js:WrapperError',
      'sys.class.js:err',
      'head.js:global.err',
    ];
  }

  error() {
    return this.args()[1];
  }

  alterError() {
    this.stack = this.stack + '\n' + this.error().stack;
  }

}
