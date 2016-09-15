'use strict'

module.exports = class SysRouteNotExistError extends SYS.getError('SysRouteError') {

  create(route) {
    return super.create(null, 'SysRoute "' + route + '" don\'t exist! Use addRoute to add the SysRoute!');
  }

}
