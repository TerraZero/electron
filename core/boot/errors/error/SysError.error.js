'use strict';

module.exports = class SysError {

  constructor(deep = 0) {
    this.name = this.type();
    this._deep = 0;
    this._stack = TOOLS.Reflection.getStack();
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
    return this.getStack(SYS.config('base:debug', 'full') == 'full').join('\n');
  }

  checkCreated() {
    if (!this.created) {
      const e = new (SYS.getError('InternalError'))();
      e.create('Error wasn`t created before throwing! Use method create to set Error params!');
      throw e;
    }
  }

  getStack(native = true) {
    var stack = this.stack();
    var prints = [];

    for (var i in stack) {
      var print = '';
      var type = stack[i].getTypeName();
      var file = stack[i].getFileName();
      var line = stack[i].getLineNumber();
      var func = stack[i].getFunctionName() || stack[i].getMethodName();
      var that = stack[i].getThis();
      var isNode = !file.startsWith(SYS.base());

      if (!isNode) {
        file = file.substring(SYS.base().length);
      }

      if (isNode) {
        if (!native) continue;
        print += 'Native ' + (type ? '[' + type + '] ' : '');
      } else if (type !== null) {
        print += 'Class [' + type + '] ';
      }

      if (func) {
        print += func + '() ';
      }
      print += '(' + file + ':' + line + ')';

      prints.push(print);
    }
    return prints;
  }

  stack() {
    return this._stack;
  }

  deep() {
    return this._deep;
  }

}
