'use strict';

const RouteError = SYS.getError('RouteError');

module.exports = class RouteExistError extends RouteError {

  create(route) {
    return super.create(route, 'SysRoute "' + route.route() + '" is already in use! Use setRoute to override SysRoute!');
  }

}
