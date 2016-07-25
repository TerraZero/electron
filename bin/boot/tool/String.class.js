'use strict';

module.exports = class String {

  static match(string, expression, value = null) {
    if (value == null) {
      return string.match(expression);
    } else {
      var matches = string.match(expression);

      if (matches.length > value) return matches[value];
      return null;
    }
  }

}