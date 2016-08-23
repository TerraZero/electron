'use strict'

module.exports = class Gettable {

  getting(key = null) {
    if (key === null) return this;

    var keys = key.split('.');
    var object = this;

    for (var i in keys) {
      if (TOOLS.isArray(object)) {
        object = object[parseInt(keys[i])];
      } else if (TOOLS.isFunction(object[keys[i]])) {
        object = object[keys[i]]();
      } else {
        object = object[keys[i]];
      }
    }
    return object;
  }

};