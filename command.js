'use strict';

const args = require('yargs').argv;

require('./head.js');
global.CLI = SYS.use('bin/boot/cli.class');

const Command = SYS.use('bin/commands/Command.class');

// start script
console.log();

var command = args._[0];
var _args = args._;

Command.execute(command, _args);

// end script
console.log();

// TODO
SYS.get('database.connection').end();