'use strict';

/**
  * @Interface("Gettable")
  */
module.exports = class Gettable {

  getting(key = null, fallback = null) {
    return this.gettingInfo(key, fallback).object;
  }

  gettingRoute(key = null) {
    return this.gettingInfo(key).path.join('.');
  }

  gettingInfo(key = null, fallback = null) {
    if (key === null) return this;

    var result = {
      path: [],
      object: this,
    };
    var keys = key.split('.');
    var object = this;

    for (var i in keys) {
      if (TOOLS.isArray(object) && TOOLS.isInt(keys[i])) {
        object = object[parseInt(keys[i])];
      } else if (TOOLS.isFunction(object[keys[i]])) {
        object = object[keys[i]]();
      } else {
        object = object[keys[i]];
      }

      if (object === undefined) {
        object = fallback;
        break;
      }
      result.path.push(keys[i]);
    }
    result.object = object;
    return result;
  }

};