'use strict';

module.exports = class Array {

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
    value = value || function(value) { return value; };

    var _array = [];
    var negative = expression.startsWith('!');

    if (negative) {
      var pattern = new RegExp(expression.substring(1));

      for (var index in array) {
        if (!pattern.test(value(array[index]))) {
          _array.push(array[index]);
        }
      }
    } else {
      var pattern = new RegExp(expression);

      for (var index in array) {
        if (pattern.test(value(array[index]))) {
          _array.push(array[index]);
        }
      }
    }
    return _array;
  },

}