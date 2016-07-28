'use strict';

module.exports = class Array {

  static maxLength() {
    var args = TOOLS.args(arguments);

    var max = 0;
    for (var index in args) {
      if (TOOLS.isArray(args[index]) && max < args[index].length) {
        max = args[index].length;
      }
    }
    return max;
  }

  /**
   * Merge array's into one array
   *
   * @param (array) array  - the array to merge in
   * @param (array) ...    - a list of array's to merge
   * @return (param:array) - the merged array
   */
  static merge(array) {
    var args = TOOLS.args(arguments, 1);

    for (var arg in args) {
      if (TOOLS.isArray(args[arg])) {
        for (var a in args[arg]) {
          array.push(args[arg][a]);
        }
      } else {
        array.push(args[arg]);
      }
    }
    return array;
  }

  static filter(array, expression = null, value = null) {
    if (!expression) return array;
    if (TOOLS.isFunction(expression)) return Array.filterFunc(array, expression);

    value = value || function(value) { return value; };

    var _array = [];
    var negative = expression.startsWith('!');

    if (negative) {
      var pattern = new RegExp(expression.substring(1));

      for (var index in array) {
        if (!pattern.test((array[index].__filterValue || value)(array[index]))) {
          _array.push(array[index]);
        }
      }
    } else {
      var pattern = new RegExp(expression);

      for (var index in array) {
        if (pattern.test((array[index].__filterValue || value)(array[index]))) {
          _array.push(array[index]);
        }
      }
    }
    return _array;
  }

  static filterFunc(array, func = null) {
    if (!func) return array;

    var _array = [];

    for (var index in array) {
      if (func(array[index], index)) {
        _array.push(array[index]);
      }
    }
    return _array;
  }

}