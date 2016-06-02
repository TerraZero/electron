'use strict';

module.exports = class Controller {

  static subject() {
    this.inner = null;
  }

  static instance() {
    if (this.inner == null) {
      this.inner = new this();
    }
    return this.inner;
  }

  constructor() {
    this.table = 'node';
  }

  info() {

  }

}