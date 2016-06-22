'use strict';

const Module = SYS.use('!Module');

module.exports = class Arrays extends Module {

  remove(array) {
    var args = SYS.arrayArgs(arguments, 1);
    var index = -1;

    for (var i in args) {
      while ((index = array.indexOf(args[i])) !== -1) {
        array.slice(index, 1);
      }
    }
    return array;
  }

  merge(array, merge) {
    for (var i in merge) {
      array.push(merge[i]);
    }
    return array;
  }

};