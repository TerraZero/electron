'use strict';

const args = require('yargs').argv;

require('./head.js');
global.CLI = SYS.use('bin/boot/cli');


// start script
console.log();
console.log('start command');
console.log();

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

var annotation = new TOOLS.Annotation(__dirname + '/annotations.js').getDefinitions();
console.log(annotation);

// end script
console.log();
console.log('end command');
console.log();