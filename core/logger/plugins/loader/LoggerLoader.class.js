'use strict';

/**
  * @SysRoute(
  *   value="logger",
  *   description="Get the relevant logger"
  * )
  * @SysRoute(
  *   value="logger.struct",
  *   description="Get the logger struct to set functions"
  * )
  */
module.exports = class LoggerLoader {

  static getRoute(sysroute) {
    if (sysroute.route() == 'logger') {
      return use(this.route || 'logger.main');
    } else if (sysroute.route() == 'logger.struct') {
      return this;
    }
  }

  static setLogger(route) {
    this.route = route;
  }

}