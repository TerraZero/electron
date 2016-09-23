'use strict';

const RouteError = SYS.getError('RouteError');

module.exports = class RouteNotExistError extends RouteError {

  createMessage() {
    return this.args('message') || 'SysRoute "<route>" don\'t exist! Use addRoute to add the SysRoute!';
  }

}
