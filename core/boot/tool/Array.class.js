'use strict';

module.exports = class Array {

  static generate(number, func) {
    let array = [];

    for (let i = 0; i < number; i++) {
      array.push(func.call(undefined, i, number, array));
    }
    return array;
  }

  static run(array, f) {
    for (let i in array) {
      array[i] = f.call(undefined, array[i], i, array);
    }
    return array;
  }

  static maxLength() {
    let args = TOOLS.args(arguments);

    let max = 0;
    for (let index in args) {
      if (TOOLS.isArray(args[index]) && max < args[index].length) {
        max = args[index].length;
      }
    }
    return max;
  }

  static startsWithKey(array, string, value = null) {
    value = value || function(value) { return value; };
    for (let index in array) {
      if ((array[index].__stringValue || value)(array[index]).startsWith(string)) return index;
    }
    return null;
  }

  static startsWith(array, string, value = null) {
    let key = Array.startsWithKey(array, string, value);

    if (key) return array[key];
    return null;
  }

  static inArrayKey(array, string, value = null) {
    value = value || function(value) { return value; };
    for (let index in array) {
      if ((array[index].__stringValue || value)(array[index]) == string) return index;
    }
    return null;
  }

  static inArray(array, string, value = null) {
    let key = Array.inArrayKey(array, string, value);

    if (key) return array[key];
    return null;
  }

  static split(array, explode) {
    let splited = [[]];
    let index = 0;

    for (let i in array) {
      if (array[i] == explode) {
        splited.push([]);
        index++;
      } else {
        splited[index].push(array[i]);
      }
    }
    return splited;
  }

  /**
   * Merge array's into one array
   *
   * @param (array) array  - the array to merge in
   * @param (array) ...    - a list of array's to merge
   * @return (param:array) - the merged array
   */
  static merge(array) {
    let args = TOOLS.args(arguments, 1);

    for (let arg in args) {
      if (TOOLS.isArray(args[arg])) {
        for (let a in args[arg]) {
          array.push(args[arg][a]);
        }
      } else {
        array.push(args[arg]);
      }
    }
    return array;
  }

  /**
    * @Magic(
    *   value="__filterValue",
    *   description="give string value to filter objects with regex"
    * )
    */
  static filter(array, expression = null, value = null) {
    if (!expression) return array;
    if (TOOLS.isFunction(expression)) return Array.filterFunc(array, expression);

    value = value || function(value) { return value; };

    let _array = [];
    let negative = expression.startsWith('!');

    if (negative) {
      let pattern = new RegExp(expression.substring(1));

      for (let index in array) {
        if (!pattern.test((array[index].__filterValue || value)(array[index]))) {
          _array.push(array[index]);
        }
      }
    } else {
      let pattern = new RegExp(expression);

      for (let index in array) {
        if (pattern.test((array[index].__filterValue || value)(array[index]))) {
          _array.push(array[index]);
        }
      }
    }
    return _array;
  }

  static filterFunc(array, func = null) {
    if (!func) return array;

    let _array = [];

    for (let index in array) {
      if (func(array[index], index)) {
        _array.push(array[index]);
      }
    }
    return _array;
  }

}