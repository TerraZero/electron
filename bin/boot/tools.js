'use strict';

const Boot = require('./boot.js');

module.exports = class Tools {

  /**
    * Get all args as array
    *
    * @param (arguments) args         - the arguments variable of a function
    * @param (int) offset (optional)  - the offset of the arguments array
    * @return array                   - the arguments as array
    */
  static args(args, offset = 0) {
    var _args = [];

    for (var i = offset; i < args.length; i++) {
      _args.push(args[i]);
    }
    return _args;
  }

  /**
    * Pass variables back to a stream and continue it
    */
  static passOn(object, callback = null, args = []) {
    if (!callback) return;

    var _args = args;

    // if args are an arguments object than convert it into an array
    if (Tools.isArguments(_args)) {
      _args = Tools.args(_args);
    }
    callback.apply(object, _args);
  }


  /**
    * Detemine if the object is a type of a struct
    *
    * @param object         - the object to test
    * @param (class) struct - the struct to test the object
    * @return boolean       - if object is struct
    */
  static is(object, struct) {
    return object instanceof struct;
  }

  /**
    * Determine if the struct object is based on base
    *
    * @param (class) struct - the class object to test
    * @param (class) base   - the class object to test if it based of
    * @return boolen        - if struct is based on base
    */
  static isBased(struct, base) {
    return struct.prototype instanceof base;
  }

  /**
    * Determine if the object is a function
    *
    * @param object   - the object to test
    * @return boolean - if object is function
    */
  static isFunction(object) {
    return typeof object == 'function';
  }

  /**
    * Determine if the object is an arguments object
    *
    * @param object   - the object to test
    * @return boolean - if object is arguments
    */
  static isArguments(object) {
    return Object.prototype.toString.call(object) == '[object Arguments]';
  }

  /**
    * Determine if the object is an array
    *
    * @param object   - the object to test
    * @return boolean - if object is array
    */
  static isArray(object) {
    return Object.prototype.toString.call(object) === '[object Array]';
  }

  /**
    * Determine if the object is defined
    *
    * @param object   - the object to test
    * @return boolean - if object is defined
    */
  static isDef(object) {
    return object !== undefined;
  }

  /**
    * Define a default getter setter function for fields
    *
    * @param object           - the object of the field (mostly 'this')
    * @param variable         - the variable of the function
    * @param (string) name    - the name of the field
    * @return [object]        - if the setter will call
    *         [object[name]]  - if the getter will call
    */
  static setGet(object, variable, name) {
    if (Tools.isDef(variable)) {
      object[name] = variable;
      return object;
    } else {
      return object[name];
    }
  }

  static getStack(filter = null) {
    var stack = Boot.getStack();
    var files = [];

    for (var i in stack) {
      files.push(stack[i].getFileName());
    }
    return Boot.filter(files, filter);
  }

  /**
    * Sort the objects after an order
    *
    * @param (array) order - the order of objects
    * @param (array) objects - the objects to sort
    * @param (function) sorting (optional) - function(order_value, object_value, order_index, object_index)
    * @return new array - the sorted array
    */
  static sorting(order, objects, sorting = null) {
    if (sorting == null) {
      sorting = function(order_value, object_value, order_index, object_index) {
        return order_value == object_index;
      };
    }
    var ordered = [];

    for (var index in order) {
      for (var o in objects) {
        if (sorting(order[index], objects[o], index, o)) {
          ordered.push(objects[o]);
        }
      }
    }
    return ordered;
  }

};