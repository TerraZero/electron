'use strict';

const RouteError = SYS.getError('RouteError');

module.exports = class RouteExistError extends RouteError {

  createMessage() {
    return this.args('message') || 'SysRoute "<route>" is already in use! Use setRoute to override SysRoute!';
  }

}
