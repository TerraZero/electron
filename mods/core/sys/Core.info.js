'use strict';

const Info = SYS.use('bin/sys/Info.class');

module.exports = class CoreInfo extends Info {

  frames() {
    return [
      {
        path: 'core',
        file: this.path('./CoreFrame.class'),
      }
    ];
  }

};