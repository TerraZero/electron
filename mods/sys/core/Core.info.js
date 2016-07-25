'use strict';

const Info = SYS.use('bin/sys/Info');

module.exports = class CoreInfo extends Info {

  routines() {
    return this.list(SYS.base() + '/bin/boot/routines', '!.*ClassRoutine\.class\.js');
  }

  frames() {
    return [
      {
        path: 'core',
        file: this.path('./CoreFrame'),
      }
    ];
  }

};