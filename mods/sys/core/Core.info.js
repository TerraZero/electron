'use strict';

const Info = SYS.use('bin/sys/Info');

module.exports = class CoreInfo extends Info {

  routines() {
    var files = this._boot.list(SYS.base() + '/bin/boot/routines');
    return this.path(this._boot.filter(files, '!.*ClassRoutine\.class\.js'));
  }

  frames() {
    return [
      {
        path: 'core',
        file: this.path('./CoreFrame.class.js'),
      }
    ];
  }

};