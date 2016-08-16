/* global SYS */
/* global TOOLS */
'use strict';

module.exports = class UseRoutine {

  isRoutine(path) {
    return false;
  }

  use(path) {
    return require(path.resolve('.js'));
  }

}