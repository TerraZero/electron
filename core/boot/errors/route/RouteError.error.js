'use strict'

module.exports = class RouteError extends SYS.getError('SysError') {

  create(route, message) {
    super.create(message);
    this._route = route;
    return this;
  }

  route() {
    return this._route;
  }

}
