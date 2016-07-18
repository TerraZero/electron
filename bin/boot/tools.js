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
    if (!callback) return undefined;

    var _args = args;

    // if args are an arguments object than convert it into an array
    if (this.isArguments(_args)) {
      _args = this.args(_args);
    }
    return callback.apply(object, _args);
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
    if (this.isDef(variable)) {
      object[name] = variable;
      return object;
    } else {
      return object[name];
    }
  }

  static log() {
    var args = TOOLS.args(arguments);
    var caller = Boot.getCaller(1);

    console.log(caller.dir + '/' + caller.base);
    console.log.apply(console, args);
  }

  /**
    * Get Debug Callstack
    */
  static getDebug(filter = null, offset = 0) {
    var stack = Boot.getStack();
    var fullstack = [];

    for (var index = offset + 2; index < stack.length; index++) {
      var line = [];
      if (stack[index].getTypeName()) {
        line.push(stack[index].getTypeName() + ':');
      }
      if (stack[index].getMethodName()) {
        line.push(stack[index].getMethodName() + ' -> ');
      }
      line.push(stack[index].getFileName().substring(SYS.base().length + 1) + ':' + stack[index].getLineNumber());
      fullstack.push(line.join(''));
    }
    return Boot.filter(fullstack, filter);
  }

  static logDebug(filter = null, offset = 0) {
    this.log(this.getDebug(filter, offset + 1));
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
      sorting = function defaultSorting(order_value, object_value, order_index, object_index) {
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

  /**
    * Merge array's into one array
    *
    * @param (array) array  - the array to merge in
    * @param (array) ...    - a list of array's to merge
    * @return (param:array) - the merged array
    */
  static merge(array) {
    var args = this.args(arguments, 1);

    for (var arg in args) {
      if (this.isArray(args[arg])) {
        for (var a in args[arg]) {
          array.push(args[arg][a]);
        }
      } else {
        array.push(args[arg]);
      }
    }
    return array;
  }

  /**
    * Define getter and/or setter for objects
    */
  static define(object, name, getter = null, setter = null) {
    Object.defineProperty(object, name, {get: getter, set: setter});
  }

  static sync(callback) {
    return {
      number: 0,
      index: 0,
      sync: function() {
        var that = this;
        that.number++;
        return function() {
          that.index++;
          if (that.number == that.index) {
            return TOOLS.passOn(null, callback, arguments);
          }
        };
      },
    };
  }

};