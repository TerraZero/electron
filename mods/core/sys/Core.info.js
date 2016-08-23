'use strict';

const Info = SYS.use('Info.base');

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