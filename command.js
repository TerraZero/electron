'use strict';

const args = require('yargs').argv;

require('./head.js');
global.CLI = SYS.use('bin/boot/cli');

const Command = SYS.use('bin/command/Command');

// start script
console.log();
console.log('start command');
console.log();

var command = args._[0];
var _args = args._;

Command.execute(command, _args);

// end script
console.log();
console.log('end command');
console.log();