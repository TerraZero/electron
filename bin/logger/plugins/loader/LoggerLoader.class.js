'use strict';

/**
  * @ID(
  *   value="logger",
  *   description="Get the relevant logger",
  *   params={
  *     route: {type: "string", value: null}
  *   }
  * )
  */
module.exports = class LoggerLoader {

  static getPlugin(route = null) {
    if (route) {
      this.route = route;
    }
    return SYS.get(this.route || 'logger.cli');
  }

}