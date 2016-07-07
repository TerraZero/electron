'use strict';

const fs = require('fs');
const Path = require('path');

module.exports = {

  list: function(dir, expression, recursive = null) {
    var results = [];

    this.walk(dir, results, recursive);
    return this.filter(results, expression);
  },

  walk: function(dir, results, recursive = null, deep = 0) {
    var list = fs.readdirSync(dir);

    for (var i in list) {
      var file = path.resolve(dir, list[i]);
      var stat = fs.statSync(file);

      if (stat && stat.isDirectory()) {
        if (recursive == null || recursive > deep) this.walk(file, results, recursive, deep + 1);
      } else {
        results.push(file);
      }
    }
  }

  filter(array, expression = null, value = null) {
    if (!expression) return array;
    value = value || function(value) { return value; };
    var pattern = new RegExp(expression);
    var _array = [];

    for (var index in array) {
      if (pattern.test(value(array[index]))) {
        _array.push(array[index]);
      }
    }
    return _array;
  }

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

    return this.match(parse.name, '\.([^.]*)\.', 0);
  },

};