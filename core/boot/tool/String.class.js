'use strict';

module.exports = class String {

  static match(string, expression, value = null) {
    if (value == null) {
      return string.match(expression);
    } else {
      let matches = string.match(expression);

      if (matches.length > value) return matches[value];
      return null;
    }
  }

  static splitByLength(string, length) {
    let splitted = [];

    for (let i = 0; i * length < string.length; i++) {
      splitted.push(string.substring(i * length, Math.min((i + 1) * length, string.length)));
    }
    return splitted;
  }

  static replace(string, replacings) {
    for (let pattern in replacings) {
      string = string.split(pattern).join(replacings[pattern]);
    }
    return string;
  }

}