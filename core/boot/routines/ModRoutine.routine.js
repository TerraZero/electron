'use strict';

var UseRoutine = SYS.use('./UseRoutine.routine');

module.exports = class ModRoutine extends UseRoutine {

  isRoutine(path) {
    return path.match('.*\.mod[^\/]*$');
  }

  use(path) {
    return SYS.mod(path.path().substring(0, path.path().length - 4));
  }

}