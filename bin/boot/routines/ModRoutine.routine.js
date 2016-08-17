/* global SYS */
'use strict';

var UseRoutine = SYS.use('./UseRoutine.routine');

module.exports = class ModRoutine extends UseRoutine {

  isRoutine(path) {
    return path.match('.*\.mod[^\/]*$');
  }

  use(path) {
    var struct = require(path.resolve('.js'));

    return struct.build.apply(struct);
  }

}