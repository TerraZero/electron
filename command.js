'use strict';

const args = require('yargs').argv;

require('./head.js');
// set default logger to cli logger
use('logger.struct').setLogger('logger.cli');

const Command = use('command');

// start script
console.log();

var command = args._[0];

try {
  Command.execute(command, args);
} catch (e) {
  console.error(e);
}

// end script
console.log();

// TODO
use('db').end();