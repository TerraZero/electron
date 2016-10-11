'use strict';

const Stack = require('stack-trace');

module.exports = class SysError {

  constructor(args) {
    this._args = args;
    this._relevant = this.getRelevantStack();

    this.name = this.createName();
    this.message = this.createMessage();
    this.stack = this.createStack();
    this.replacing();
  }

  type() {
    return this.constructor.name;
  }

  args(field = null) {
    if (field === null) return this._args;
    if (typeof field === 'string') {
      const define = this.define();

      for (let index in define) {
        if (define[index] === field) return this._args[index];
      }
      return null;
    } else {
      return this._args[field];
    }
  }

  getArg(field = null) {
    if (typeof field === 'string') {
      if (typeof this[field + 'String'] === 'function') {
        return this[field + 'String']();
      }

      const define = this.define();

      for (let index in define) {
        if (define[index] === field) return this._args[index];
      }
      return null;
    } else {
      return this._args[field];
    }
  }

  relevant() {
    return this._relevant;
  }

  createName() {
    return this.type();
  }

  createStack() {
    const debug = SYS.config('base:debug', 'all');

    switch (debug) {
      case 'all' :
        return this.createStackAll();
      case 'full' :
        return this.createStackFull();
      case 'normal' :
        return this.createStackNormal();
      case 'small' :
        return this.createStackSmall();
    }

    return this.name + ': ' + this.message + ' (no debug mode "' + debug + '")';
  }

  createStackAll() {
    const s = [];
    const relevant = this.relevant();
    const base = SYS.base();

    for (let i in relevant) {
      let print = [];
      let type = relevant[i].getTypeName();
      let file = relevant[i].getFileName();
      let line = relevant[i].getLineNumber();
      let func = relevant[i].getFunctionName() || relevant[i].getMethodName();
      //   let that = stack[i].getThis();
      let isNode = !file.startsWith(base);

      if (!isNode) {
        file = file.substring(SYS.base().length + 1);
      }

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
    return this.name + ': "' +  this.message + '"\n\t' + s.join('\n\t');
  }

  createStackFull() {
    return this.createStackAll();
  }

  createStackNormal() {
    const s = [];
    const relevant = this.relevant();
    const base = SYS.base();

    for (let i in relevant) {
      let print = [];
      let type = relevant[i].getTypeName();
      let file = relevant[i].getFileName();
      let line = relevant[i].getLineNumber();
      let func = relevant[i].getFunctionName() || relevant[i].getMethodName();
      let isNode = !file.startsWith(base);

      if (isNode) continue;

      file = file.substring(SYS.base().length + 1);

      print.push(file + ':' + line);
      if (type && func) {
        print.push('[Class ' + type + '.' + func + '()]');
      } else if (type) {
        print.push('[Class ' + type + ']');
      } else if (func) {
        print.push('[' + func + '()]');
      }

      s.push(print.join(' '));
    }
    return this.name + ': "' + this.message + '"\n\t' + s.join('\n\t');
  }

  createStackSmall() {
    const base = SYS.base();
    let relevant = this.relevant()[0];
    let file = relevant.getFileName();

    if (file.startsWith(base)) {
      file = file.substring(base.length + 1);
    }
    return this.name + ': "' + this.message + '" (at ' + file + ':' + relevant.getLineNumber() + ')';
  }

  createMessage() {
    return this.args('message');
  }

  stackIgnore() {
    return [
      this.type() + '.error.js:' + this.type(),
      'sys.class.js:err',
      'head.js:global.err',
    ];
  }

  getRelevantStack() {
    const debug = SYS.config('base:debug', 'all');
    const stack = Stack.get();

    if (debug === 'all') return stack;

    const ignore = this.stackIgnore();
    const relevant = [];
    let state = 0;

    for (let i in stack) {
      let file = stack[i].getFileName();
      let func = stack[i].getFunctionName() || stack[i].getMethodName();

      if (state < ignore.length) {
        if ((file + ':' + func).endsWith(ignore[state])) { state++; continue; }
      }
      if (state === 0) continue;

      relevant.push(stack[i]);
    }
    if (relevant.length === 0) return stack;
    return relevant;
  }

  // gives a list of arguments
  define() {
    return [
      'message',
    ];
  }

  replacing() {
    const define = this.define();

    for (let index in define) {
      this.stack = this.stack.split('<' + define[index] + '>').join(this.getArg(define[index]));
    }
  }

  // for the log function
  inspect() {
    return this.stack;
  }

}