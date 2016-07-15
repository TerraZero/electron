'use strict';

module.exports = class CoreInfo {

  constructor(boot) {
    this._boot = boot;
  }

  routines() {
    var files = this._boot.list(SYS.base() + '/bin/boot/routines');
    return this._boot.filter(files, '!.*ClassRoutine\.class\.js');
  }

};