'use strict';

const SysError = SYS.getError('SysError');

module.exports = class WrapperError extends SysError {

  createStackAll() {
    return super.createStackAll() + '\n-- ' + this.error().stack;
  }

  createStackFull() {
    return this.name + ': "' + this.message + '"\n-- ' + this.error().stack;
  }

  createStackNormal() {
    return this.createStackFull();
  }

  createStackSmall() {
    return super.createStackSmall() + '\n-- ' + this.error().stack;
  }

  error() {
    return this.args()[1];
  }

}
