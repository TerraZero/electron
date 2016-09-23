'use strict';

const ContextError = SYS.getError('ContextError');

module.exports = class RequiredFieldError extends ContextError {

  createMessage() {
    if (this.isStatic()) {
      return 'The static method "<func>" of class "<struct>" has a required field "<field>"!';
    } else {
      return 'The method "<func>" of class "<struct>" has a required field "<field>"!';
    }
  }

  define() {
    return [
      'struct',
      'func',
      'field',
    ];
  }

}
