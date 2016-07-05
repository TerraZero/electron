'use strict';

const Module = require('./../classes/sys/Module.class.js');

module.exports = class Arrays extends Module {

  remove(array) {
    var args = SYS.arrayArgs(arguments, 1);

    array = array.filter(function(item) {
      return args.indexOf(item) < 0;
    });
    return array;
  }

  merge(array, merge) {
    for (var i in merge) {
      array.push(merge[i]);
    }
    return array;
  }

};