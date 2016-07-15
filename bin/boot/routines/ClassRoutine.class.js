'use strict';

var UseRoutine = require('./UseRoutine.class.js');

module.exports = class ClassRoutine extends UseRoutine {

  type() {
    return 'class';
  }

}