'use strict';

let Stack = require('stack-trace');

module.exports = class Reflection {

  static getCaller(offset = 0) {
    let stack = Reflection.getStack();

    // add a empty string as offset to avoid recursion
    return new TOOLS.Path('$' + stack[offset + 2].getFileName(), '').parse();
  }

  static getStack() {
    return Stack.get();
  }

  static getStackArray() {
    let stack = Reflection.getStack();
    let array = [];

    for (let i in stack) {
      array.push(stack[i].getFileName() + ':' + stack[i].getLineNumber());
    }
    return array;
  }

}