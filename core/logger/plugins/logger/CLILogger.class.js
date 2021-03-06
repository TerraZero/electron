'use strict';

const Logger = use('base.logger');

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
    let args = TOOLS.args(arguments);

    args[0] = args[0].error;
    TOOLS.award(this, 'console', args);
  }

  warn() {
    let args = TOOLS.args(arguments);

    args[0] = ('WARNING: ' + args[0]).warn;
    TOOLS.award(this, 'console', args);
  }

  log() {
    TOOLS.award(this, 'console', arguments);
  }

  console() {
    console.log.apply(console, TOOLS.args(arguments));
  }

  success() {
    let args = TOOLS.args(arguments);

    args[0] = ('SUCCESS: ' + args[0]).input;
    TOOLS.award(this, 'console', args);
  }



  // options(message, options) {
  //   let p = charm.position();
  //   console.log(p);
  // }

  table(data) {
    if (TOOLS.isArray(data)) data = {rows: data};

    let options = {
      head: data.head,
    };

    if (data.colWidths) options.colWidths = data.colWidths;

    // merge fields
    if (data.head && data.noMerge !== true) {
      let splitting = TOOLS.truncInt((this.cliWidth() - data.head.length * 3 + 2) / data.head.length);
      if (!options.colWidths) options.colWidths = TOOLS.Array.generate(data.head.length, function() {return splitting});

      for (let r in data.rows) {
        for (let c in data.rows[r]) {
          if (TOOLS.isString(data.rows[r][c])) {
            // TODO make recursive
            data.rows[r][c] = TOOLS.String.splitByLength(data.rows[r][c], splitting - 2).join('\n');
          } else if (TOOLS.isArray(data.rows[r][c])) {
            data.rows[r][c] = data.rows[r][c].join('\n');
          }
        }
      }
    }

    let table = new Table(options);

    for (let r in data.rows) {
      table.push(data.rows[r]);
    }

    this.console(table.toString());
  }

  input(types, message, fallback = null) {
    if (TOOLS.isString(types)) types = [types];
    const Validater = use('datatype');
    let valid = false;
    let input = null;

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

  confirm(message) {
    let confirmed = null;

    while (confirmed !== 'y' && confirmed !== 'n') {
      confirmed = this.input('string', message + ' (y/n)?');
    }
    return confirmed === 'y';
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