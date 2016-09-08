'use strict';

const Logger = SYS.route('base.logger');

const colors = require('colors');
const readlineSync = require('readline-sync');
const Table = require('cli-table2');
// const promptOptions = require('prompt-autocomplete');
// const charm = require('charm')(process);

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



  // options(message, options) {
  //   var p = charm.position();
  //   console.log(p);
  // }

  table(data) {
    if (TOOLS.isArray(data)) data = {rows: data};

    var options = {
      head: data.head,
    };

    if (data.colWidths) options.colWidths = data.colWidths;

    // merge fields
    if (data.head && data.noMerge !== true) {
      var splitting = TOOLS.truncInt((this.cliWidth() - data.head.length * 3 + 2) / data.head.length);
      if (!options.colWidths) options.colWidths = TOOLS.Array.generate(data.head.length, function() {return splitting});

      for (var r in data.rows) {
        for (var c in data.rows[r]) {
          if (TOOLS.isString(data.rows[r][c])) {
            // TODO make recursive
            data.rows[r][c] = TOOLS.String.splitByLength(data.rows[r][c], splitting - 2).join('\n');
          } else if (TOOLS.isArray(data.rows[r][c])) {
            data.rows[r][c] = data.rows[r][c].join('\n');
          }
        }
      }
    }

    var table = new Table(options);

    for (var r in data.rows) {
      table.push(data.rows[r]);
    }

    this.console(table.toString());
  }

  input(types, message, fallback = null) {
    if (TOOLS.isString(types)) types = [types];
    const Validater = SYS.route('datatype');
    var valid = false;
    var input = null;

    if (fallback) {
      do {
        input = readlineSync.question('> ' + message + '(' + fallback + ')' + ': ');
        if (input.length == 0) return fallback;
        input = Validater.scanCheck(types, input);
        valid = Validater.scanValid(types, input) !== false;
        if (!valid) {
          this.error(Validater.cli(types[0]));
        }
      } while (!valid);
    } else {
      do {
        input = readlineSync.question('> ' + message + ': ');
        if (input.length == 0) {
          this.error('Value is required!');
        } else {
          input = Validater.scanCheck(types, input);
        }
        valid = Validater.scanValid(types, input) !== false;
        if (!valid) {
          this.error(Validater.cli(types[0]));
        }
      } while (!valid);
    }
    return input;
  }

  cliWidth() {
    return process.stdout.columns;
  }

}

colors.setTheme({
  input: 'green',
  debug: 'white',
  warn: 'yellow',
  error: 'red',
});