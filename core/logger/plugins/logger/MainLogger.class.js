'use strict';

const Logger = use('base.logger');

/**
  * @SysRoute(
  *   value="logger.main",
  *   description="Main logger for main execution"
  * )
  */
module.exports = class MainLogger extends Logger {

  error() {
    console.error.apply(console, TOOLS.args(arguments));
  }

  warn() {
    console.warn.apply(console, TOOLS.args(arguments));
  }

  log() {
    console.log.apply(console, TOOLS.args(arguments));
  }

  console() {
    console.log.apply(console, TOOLS.args(arguments));
  }

}