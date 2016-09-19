'use strict';

const SysError = SYS.getError('SysError');

module.exports = class RouteError extends SysError {

  create(route, message) {
    super.create(message);
    this._route = route;
    return this;
  }

  route() {
    return this._route;
  }

}
