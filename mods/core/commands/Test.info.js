'use strict';

const Info = SYS.use('bin/sys/Info');

module.exports = class TestCommandInfo extends Info {

  commands() {
    return [
      {
        name: 'test',
        file: this.path('./TestCommandInfo'),
      },
    ];
  }

};