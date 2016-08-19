'use strict';

const colors = require('colors');
const readlineSync = require('readline-sync');

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

  static input(message) {
    if (TOOLS.isString(message)) {
      return readlineSync.question('> ' + message);
    }
  }

}

colors.setTheme({
  input: 'green',
  debug: 'white',
  warn: 'yellow',
  error: 'red',
});