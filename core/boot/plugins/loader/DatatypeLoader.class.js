'use strict';

/**
  * @SysRoute(
  *   value="datatype",
  *   description="Loader for datatypes"
  * )
  * @SysRoute(
  *   value="datatype.<value>",
  *   register="Datatype",
  *   description="Datatype handler for '<value>'",
  *   loader="datatype:type(type)",
  *   keys=["value"]
  * )
  */
module.exports = class DatatypeLoader {

  static type(type) {
    return SYS.route('datatype.' + type);
  }

  static scanValid(types, value) {
    if (TOOLS.isString(types)) types = [types];

    for (var type in types) {
      if (DatatypeLoader.valid(types[type], value)) return types[type];
    }
    return false;
  }

  static scanCheck(types, value) {
    if (TOOLS.isString(types)) types = [types];

    for (var type in types) {
      var check = DatatypeLoader.check(types[type], value);

      if (check !== null && check !== undefined) {
        return check;
      }
    }
  }

  static valid(type, value) {
    var response = DatatypeLoader.call('valid', type, value);

    return (response === null || response === undefined ? false : response);
  }

  static check(type, value) {
    return DatatypeLoader.call('check', type, value);
  }

  static cli(type) {
    return DatatypeLoader.call('cli', type);
  }

  static call(func, type) {
    var args = TOOLS.args(arguments, 1);
    var object = DatatypeLoader.type(type);

    if (object === null) return null;

    if (TOOLS.isFunction(object[func + type])) {
      return object[func + type].apply(object, args);
    } else {
      return object[func].apply(object, args);
    }
  }

}