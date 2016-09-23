'use strict';

const SysError = SYS.getError('SysError');

module.exports = class ContextError extends SysError {

  createMessage() {
    if (this.isStatic()) {
      return 'The static class "<struct>" has an error!';
    } else {
      return 'The class "<struct>" has an error!';
    }
  }

  define() {
    return [
      'struct',
    ];
  }

  struct() {
    return this.args('struct');
  }

  structString() {
    if (this.isStatic()) {
      return this.struct().name;
    } else {
      return this.struct().constructor.name;
    }
  }

  isStatic() {
    return this.struct().constructor.name === 'Function';
  }

}
