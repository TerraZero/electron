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
  *   keys=["value"],
  *   dir="datatypes"
  * )
  */
module.exports = class DatatypeLoader {

  static type(type) {
    return use('datatype.' + type);
  }

  static scanValid(types, value) {
    if (TOOLS.isString(types)) types = [types];

    for (let type in types) {
      if (DatatypeLoader.valid(types[type], value)) return types[type];
    }
    return false;
  }

  static scanCheck(types, value) {
    if (TOOLS.isString(types)) types = [types];

    for (let type in types) {
      let check = DatatypeLoader.check(types[type], value);

      if (check !== null && check !== undefined) {
        return check;
      }
    }
  }

  static valid(type, value) {
    let response = DatatypeLoader.call('valid', type, value);

    return (response === null || response === undefined ? false : response);
  }

  static check(type, value) {
    return DatatypeLoader.call('check', type, value);
  }

  static cli(type) {
    return DatatypeLoader.call('cli', type);
  }

  static call(func, type) {
    let args = TOOLS.args(arguments, 1);
    let object = DatatypeLoader.type(type);

    if (object === null) return null;

    if (TOOLS.isFunction(object[func + type])) {
      return object[func + type].apply(object, args);
    } else {
      return object[func].apply(object, args);
    }
  }

}