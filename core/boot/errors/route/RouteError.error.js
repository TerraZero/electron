'use strict';

const SysError = SYS.getError('SysError');

module.exports = class RouteError extends SysError {

  define() {
    return [
      'route',
      'message',
    ];
  }

  routeString() {
    const route = this.args('route');

    if (typeof route === 'string') {
      return route;
    } else {
      return route.route();
    }
  }

}
