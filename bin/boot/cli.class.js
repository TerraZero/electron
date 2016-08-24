'use strict';

const colors = require('colors');
const readlineSync = require('readline-sync');
const Table = require('cli-table2');

module.exports = class CLI {

  static error() {
    var args = TOOLS.args(arguments);

    args[0] = args[0].red;
    TOOLS.award(CLI, 'console', args);
  }

  static table(data) {
    if (TOOLS.isArray(data)) data = {rows: data};

    var options = {
      head: data.head,
    };

    if (data.colWidths) options.colWidths = data.colWidths;

    var table = new Table(options);

    for (var i in data.rows) {
      table.push(data.rows[i]);
    }
    console.log(table.toString());
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