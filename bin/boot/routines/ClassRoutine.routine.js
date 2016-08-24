'use strict';

// !!! Don't use SYS.use before boot
var UseRoutine = require('./UseRoutine.routine.js');

module.exports = class ClassRoutine extends UseRoutine {

  isRoutine(path) {
    return path.match('.*\.class[^\/]*$');
  }

  use(path) {
    return require(path.resolve('.js'));
  }

}