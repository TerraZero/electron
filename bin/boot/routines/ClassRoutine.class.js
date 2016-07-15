'use strict';

// !!! Don't use SYS.use before boot
var UseRoutine = require('./UseRoutine.class.js');

module.exports = class ClassRoutine extends UseRoutine {

  type() {
    return 'class';
  }

}