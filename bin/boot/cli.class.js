'use strict';

var colors = require('colors');

module.exports = class CLI {

  static error() {
    var args = TOOLS.args(arguments);

    args[0] = args[0].red;
    console.log.apply(console, args);
  }

  static log() {
    var args = TOOLS.args(arguments);

    args[0] = args[0].debug;
    console.log.apply(console, args);
  }

}

colors.setTheme({
  input: 'green',
  debug: 'white',
  warn: 'yellow',
  error: 'red',
});