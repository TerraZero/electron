'use strict';

const Info = SYS.route('base.info');

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