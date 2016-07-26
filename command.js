'use strict';

require('./head.js');
global.CLI = SYS.use('bin/boot/cli');
console.log();

var args = require('yargs').argv;
var commands = SYS.info('commands');

var exe = args._[0];
var exe = exe.split('.');

for (var index in commands) {
  if (commands[index].name == exe[0]) {
    var c = SYS.use(commands[index].file, 'command', {args: [args]});

    if (TOOLS.isFunction(c[exe[1]])) {
      c[exe[1]].apply(c);
    } else {
      CLI.error('[ERROR] no command found "%s"', exe.join('.'));
    }
  }
}