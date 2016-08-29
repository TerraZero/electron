'use strict';

/**
  * @SysRoute(
  *   value="logger",
  *   description="Get the relevant logger",
  *   params={
  *     route: {type: "string", value: null}
  *   }
  * )
  */
module.exports = class LoggerLoader {

  static getRoute(route = null) {
    if (route) {
      this.route = route;
    }
    return SYS.get(this.route || 'logger.main');
  }

}