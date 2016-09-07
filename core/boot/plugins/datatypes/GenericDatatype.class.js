'use strict';

/**
  * @Datatype("string")
  * @Datatype("array")
  * @Datatype("int")
  * @Datatype("function")
  */
module.exports = class GenericDatatype {

  static valid(type, value) {
    switch (type) {
      case 'string' :
        return TOOLS.isString(value);
      case 'array' :
        return TOOLS.isArray(value);
      case 'int' :
        return TOOLS.isInt(value);
      case 'function' :
        return TOOLS.isFunction(value);
    }
    return false;
  }

  static check(type, value) {
    switch (type) {
      case 'string' :
        return value;
      case 'int' :
        var int = Number(value);

        if (GenericDatatype.valid('int', int)) {
          return int;
        } else {
          return null;
        }
      case 'array' :
        return value.split(',');
    }
  }

  static cli(type) {
    return 'Please enter a valid "' + type + '"';
  }

}