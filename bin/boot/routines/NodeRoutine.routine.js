'use strict';

var UseRoutine = SYS.use('./UseRoutine.routine');

module.exports = class NodeRoutine extends UseRoutine {

  isRoutine(path) {
    return path.match('.*\.node[^\/]*$');
  }

  use(path) {
    return require(path.path().substring(0, path.path().length() - 5));
  }

}