/* global SYS */
'use strict';

var UseRoutine = SYS.use('./UseRoutine');

module.exports = class ModRoutine extends UseRoutine {

  type() {
    return 'mod';
  }

    /**
    * Init struct
    */
  useInit(struct, options = {}) {
    return struct.build.apply(struct, options.args);
  }

}