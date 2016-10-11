'use strict';

module.exports = class Tools {

  /**
    * Get all args as array
    *
    * @param (arguments) args         - the arguments variable of a function
    * @param (int) offset (optional)  - the offset of the arguments array
    * @return array                   - the arguments as array
    */
  static args(args, offset = 0) {
    let _args = [];

    for (let i = offset; i < args.length; i++) {
      _args.push(args[i]);
    }
    return _args;
  }

  static cArgs(args, offset = 0) {
    if (Tools.isArguments(args)) {
      return Tools.args(args, offset);
    }
    return args;
  }

  /**
    * Pass variables back to a stream and continue it
    */
  static passOn(object, callback = null, args = []) {
    if (!callback) return undefined;

    return callback.apply(object, Tools.cArgs(args));
  }

  static award(context = null, funcname = null, args = []) {
    if (Tools.isFunction(funcname)) {
      funcname.apply(context, Tools.cArgs(args));
    } else {
      context[funcname].apply(context, Tools.cArgs(args));
    }
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

  static isString(object) {
    return typeof object === 'string';
  }

  static isInt(object) {
    return Number.isInteger(object);
  }

  static truncInt(number) {
    return Math.trunc(number);
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
    if (variable !== undefined) {
      object[name] = variable;
      return object;
    } else {
      return object[name];
    }
  }

  static log() {
    let args = TOOLS.args(arguments);
    let caller = TOOLS.Reflection.getCaller(1);

    console.log('FILE: ' + caller.dir + '/' + caller.base);
    console.log.apply(console, args);
  }

  /**
    * Get Debug Callstack
    */
  static getDebug(filter = null, offset = 0) {
    let stack = TOOLS.Reflection.getStack();
    let fullstack = [];

    for (let index = offset + 2; index < stack.length; index++) {
      let line = [];
      if (stack[index].getTypeName()) {
        line.push(stack[index].getTypeName() + ':');
      }
      if (stack[index].getMethodName()) {
        line.push(stack[index].getMethodName() + ' -> ');
      }
      line.push(stack[index].getFileName().substring(SYS.base().length + 1) + ':' + stack[index].getLineNumber());
      fullstack.push(line.join(''));
    }
    return TOOLS.Array.filter(fullstack, filter);
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
    let ordered = [];

    for (let index in order) {
      for (let o in objects) {
        if (sorting(order[index], objects[o], index, o)) {
          ordered.push(objects[o]);
        }
      }
    }
    return ordered;
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
        let that = this;
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

  static path(path, offset = 0) {
    if (!TOOLS.is(path, TOOLS.Path)) path = new TOOLS.Path(path, offset + 1);
    return path;
  }

}

module.exports.Path = require('./tool/Path.class.js');
module.exports.Array = require('./tool/Array.class.js');
module.exports.String = require('./tool/String.class.js');
module.exports.File = require('./tool/File.class.js');
module.exports.Reflection = require('./tool/Reflection.class.js');
module.exports.Annotation = require('./tool/Annotation.class.js');
module.exports.Route = require('./tool/Route.class.js');
module.exports.Settings = require('./tool/Settings.class.js');