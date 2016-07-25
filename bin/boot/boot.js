'use strict';

const fs = require('graceful-fs');
const Path = require('path');
var Stack = require('stack-trace');

module.exports = {

  resolvePath: function(path, offset = 0) {
    if (path.startsWith('.')) {
      path = this.getCaller(offset + 1).dir + path.substring(1);
    }
    return path;
  },

  getCaller: function(offset = 0) {
    var stack = this.getStack();

    // add a empty string as offset to avoid recursion
    return new TOOLS.Path('$' + stack[offset + 2].getFileName(), '').parse();
  },

  getStack: function() {
    return Stack.get();
  },

};