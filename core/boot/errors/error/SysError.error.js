'use strict';

module.exports = class SysError {

  getArgs(args, offset = 0) {
    var _args = [];

    for (var i = offset; i < args.length; i++) {
      _args.push(args[i]);
    }
    return _args;
  }

  constructor() {
    this._args = this.getArgs(arguments);

    this.name = this.createName();
    this.stack = this.createStack();
    this.message = this.createMessage();
  }

  type() {
    return this.constructor.name;
  }

  args() {
    return this._args;
  }

  createName() {
    return this.type();
  }

  createStack() {

  }

  createMessage() {
    return this._args[0];
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
