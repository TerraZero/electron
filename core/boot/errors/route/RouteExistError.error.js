'use strict';

module.exports = class RouteExistError extends SYS.getError('SysRouteError') {

  create(route) {
    return super.create(route, 'SysRoute "' + route.route() + '" is already in use! Use setRoute to override SysRoute!');
  }

}
