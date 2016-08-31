'use strict';

const args = require('yargs').argv;

require('./head.js');
// set default logger to cli logger
SYS.get('logger.struct').setLogger('logger.cli');

const Command = SYS.get('command');

// start script
console.log();

var command = args._[0];

Command.execute(command, args);

// end script
console.log();

// TODO
SYS.get('database.connection').end();