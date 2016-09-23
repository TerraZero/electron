'use strict';

const Stack = require('stack-trace');

module.exports = class SysError {

  constructor(args) {
    this._args = args;
    this._relevant = this.getRelevantStack();

    this.name = this.createName();
    this.message = this.createMessage();
    this.stack = this.createStack();
    this.alterError();
  }

  type() {
    return this.constructor.name;
  }

  args() {
    return this._args;
  }

  relevant() {
    return this._relevant;
  }

  createName() {
    return this.type();
  }

  createStack() {
    const s = [];
    const relevant = this.relevant();
    const base = SYS.base();
    const debug = SYS.config('base:debug', 'all') === 'all';

    for (var i in relevant) {
      var print = [];
      var type = relevant[i].getTypeName();
      var file = relevant[i].getFileName();
      var line = relevant[i].getLineNumber();
      var func = relevant[i].getFunctionName() || relevant[i].getMethodName();
      //   var that = stack[i].getThis();
      var isNode = !file.startsWith(base);

      if (!isNode) {
        file = file.substring(SYS.base().length);
      }

      if (!debug && isNode) continue;

      print.push(file + ':' + line);

      if (isNode) {
        if (type && func) {
          print.push('[Class ' + func + '()]');
        } else if (type) {
          print.push('[Class ' + type + ']');
        } else if (func) {
          print.push('[' + func + '()]');
        }
      } else {
        if (type && func) {
          print.push('[Class ' + type + '.' + func + '()]');
        } else if (type) {
          print.push('[Class ' + type + ']');
        } else if (func) {
          print.push('[' + func + '()]');
        }
      }

      s.push(print.join(' '));
    }
    return  this.name + ': "' +  this.message + '"\n\t' + s.join('\n\t');
  }

  createMessage() {
    return this._args[0];
  }

  stackIgnore() {
    return [
      'SysError.error.js:getRelevantStack',
      'SysError.error.js:SysError',
      'sys.class.js:err',
      'head.js:global.err',
    ];
  }

  getRelevantStack() {
    const stack = Stack.get();
    const ignore = this.stackIgnore();
    const relevant = [];

    for (var i in stack) {
      var file = stack[i].getFileName();
      var line = stack[i].getLineNumber();
      var func = stack[i].getFunctionName() || stack[i].getMethodName();

      if ((file + ':' + func).endsWith(ignore[i])) continue;

      relevant.push(stack[i]);
    }
    return relevant;
  }

  alterError() {

  }

  // for the log function
  inspect() {
    return this.stack;
  }

}