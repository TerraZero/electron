'use strict';

var Stack = require('stack-trace');

module.exports = class Reflection {

  static getCaller(offset = 0) {
    var stack = Reflection.getStack();

    // add a empty string as offset to avoid recursion
    return new TOOLS.Path('$' + stack[offset + 2].getFileName(), '').parse();
  }

  static getStack() {
    return Stack.get();
  }

}