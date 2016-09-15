'use strict'

const util = SYS.node('util');

module.exports = class SysError {

  constructor() {
    this.name = this.type();

    Error.captureStackTrace(this, SysError);
    this.created = false;
  }

  create(message) {
    this.created = true;
    this.message = message;
    return this;
  }

  type() {
    return this.constructor.name;
  }

  toString() {
    this.checkCreated();
    if (this.message) {
      return this.name + ' "' + this.message + '"';
    } else {
      return this.name;
    }
  }

  inspect() {
    this.checkCreated();
    return this.stack;
  }

  checkCreated() {
    if (!this.created) {
      const e = new (SYS.getError('InternalError'))();
      e.create('Error wasn`t created before throwing! Use method create to set Error params!');
      throw e;
    }
  }

}

util.inherits(module.exports, Error);
