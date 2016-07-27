'use strict';

var colors = require('colors');

module.exports = class CLI {

  static error() {
    var args = TOOLS.args(arguments);

    args[0] = args[0].red;
    TOOLS.award(CLI, 'console', args);
  }

  static log() {
    TOOLS.award(CLI, 'console', arguments);
  }

  static console() {
    console.log.apply(console, TOOLS.args(arguments));
  }

}

colors.setTheme({
  input: 'green',
  debug: 'white',
  warn: 'yellow',
  error: 'red',
});