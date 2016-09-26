'use strict';

const ContextError = SYS.getError('ContextError');

module.exports = class ArgError extends ContextError {

  createMessage() {
    if (this.isStatic()) {
      return 'The static method "<func>" of class "<struct>" expect argument <pos> to be from type "<expected>".';
    } else {
      return 'The method "<func>" of class "<struct>" expect argument <pos> to be from type "<expected>".';
    }
  }

  define() {
    return [
      'struct',
      'func',
      'pos',
      'expected',
    ];
  }

}
