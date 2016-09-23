'use strict';

const ContextError = SYS.getError('ContextError');

module.exports = class AbstractError extends ContextError {

  createMessage() {
    if (this.isStatic()) {
      return 'The static method "<func>" of class "<struct>" is abstract and not implemented!';
    } else {
      return 'The method "<func>" of class "<struct>" is abstract and not implemented!';
    }
  }

  define() {
    return [
      'struct',
      'func',
    ];
  }

}
