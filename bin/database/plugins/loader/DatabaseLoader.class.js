'use strict';

/**
  * @SysRoute(
  *   value="database",
  *   description="Loader for database connections"
  * )
  */
module.exports = class EntityLoader {

  static checkOptions(options) {
    if (options.offset !== undefined && options.limit === undefined) {
      options.offset = undefined;
      SYS.route('logger').warn('You need to set the "--limit" value to use the "--offset" value!');
    }
  }

}