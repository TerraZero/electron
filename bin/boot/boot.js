'use strict';

const fs = require('graceful-fs');
const Path = require('path');
var Stack = require('stack-trace');

module.exports = {

  match: function(string, expression, value = null) {
    if (value == null) {
      return string.match(expression);
    } else {
      var matches = string.match(expression);

      if (matches.length > value) return matches[value];
      return null;
    }
  },

  path: function(path) {
    var parse = Path.parse(path);

    return parse.dir + '/' + this.match(parse.name, '^([^.]*)', 0);
  },

  name: function(path) {
    var parse = Path.parse(path);

    return this.match(parse.name, '^([^.]*)', 0);
  },

  type: function(path) {
    var parse = Path.parse(path);

    return this.match(parse.name, '[^\.]*$', 0);
  },

  parse: function(path) {
    var parse = Path.parse(path);

    parse.type = this.type(path);
    return parse;
  },

  resolvePath: function(path, offset = 0) {
    if (path.startsWith('.')) {
      path = this.getCaller(offset + 1).dir + path.substring(1);
    }
    return path;
  },

  getCaller: function(offset = 0) {
    var stack = this.getStack();

    return this.parse(stack[offset + 2].getFileName());
  },

  getStack: function() {
    return Stack.get();
  },

};