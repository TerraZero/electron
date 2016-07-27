'use strict';

module.exports = class Command {

  static build(args) {
    return new this(args);
  }

  constructor(args) {
    this._args = args;
  }

  name() {
    return this.args().commandName;
  }

  args() {
    return this._args;
  }

  help() {
    return null;
  }

}