'use strict';

const Module = SYS.use('!Module');

module.exports = class Strings extends Module {

  static value(value) {
    return value;
  }

  filter(array, expression = null, value = null) {
    if (!expression) return array;
    value = value || Strings.value;
    var pattern = new RegExp(expression);
    var _array = [];

    for (var index in array) {
      if (pattern.test(value(array[index]))) {
        _array.push(array[index]);
      }
    }
    return _array;
  }

};