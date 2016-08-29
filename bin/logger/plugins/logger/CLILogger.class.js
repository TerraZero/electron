'use strict';

const Logger = SYS.use('Logger.base');

const colors = require('colors');
const readlineSync = require('readline-sync');
const Table = require('cli-table2');

/**
  * @SysRoute(
  *   value="logger.cli",
  *   description="Logger class for command line"
  * )
  */
module.exports = class CLILogger extends Logger {

  error() {
    var args = TOOLS.args(arguments);

    args[0] = args[0].error;
    TOOLS.award(this, 'console', args);
  }

  warn() {
    var args = TOOLS.args(arguments);

    args[0] = ('WARNING: ' + args[0]).warn;
    TOOLS.award(this, 'console', args);
  }

  log() {
    TOOLS.award(this, 'console', arguments);
  }

  console() {
    console.log.apply(console, TOOLS.args(arguments));
  }



  table(data) {
    if (TOOLS.isArray(data)) data = {rows: data};

    var options = {
      head: data.head,
    };

    if (data.colWidths) options.colWidths = data.colWidths;

    var table = new Table(options);

    for (var i in data.rows) {
      table.push(data.rows[i]);
    }
    this.console(table.toString());
  }

  input(message) {
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