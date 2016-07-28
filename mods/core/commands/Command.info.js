'use strict';

const Info = SYS.use('bin/sys/Info');

module.exports = class CommandsInfo extends Info {

  commands() {
    return [
      {
        name: 'find',
        file: this.path('./FindCommand'),
      },
    ];
  }

};