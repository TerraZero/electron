'use strict';

module.exports = class SysError {

  static subtractStack(stack, deep = 0) {
    var subtract = [];
    var ignore = true;
    var count = 0;

    for (var i in stack) {
      if (ignore && (!stack[i].getFileName().endsWith('.error.js') && !stack[i].getFileName().endsWith('Reflection.class.js'))) ignore = false;
      if (!ignore) {
        if (count++ > deep) subtract.push(stack[i]);
      }
    }
    return subtract;
  }

  constructor() {
    this.name = this.type();
    this._deep = 0;
    this.created = false;
  }

  create(message) {
    this._stack = TOOLS.Reflection.getStack();
    this.created = true;
    this.stack = this.toString() + '\n' + this.getStack();
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
    return this.toString() + '\n' + this.stack;
  }

  checkCreated() {
    if (!this.created) {
      const e = new (SYS.getError('InternalError'))();
      e.create('Error wasn`t created before throwing! Use method create to set Error params!');
      throw e;
    }
  }

  getStack(native, subtract = true) {
    native = native || SYS.config('base:debug', 'full') == 'full';
    var stack = this.stack();
    var prints = [];

    if (subtract) {
      stack = SysError.subtractStack(stack);
    }

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
    return prints.join('\n');
  }

  stack() {
    return this._stack;
  }

  deep(deep) {
    return SETGET(this, deep, '_deep');
  }

}
