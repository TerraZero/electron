'use strict';

var UseRoutine = SYS.use('./UseRoutine');

module.exports = class CommandRoutine extends UseRoutine {

  type() {
    return 'command';
  }

  useExtensions(options = {}) {
    return '.class.js';
  }

  /**
    * Init struct
    */
  useInit(struct, options = {}) {
    return struct.build.apply(struct, options.args);
  }

}