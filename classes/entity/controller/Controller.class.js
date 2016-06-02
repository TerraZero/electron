'use strict';

let inner = null;

module.exports = class Controller {

  static instance() {
    if (inner == null) {
      inner = new Controller();
    }
    return inner;
  }

  constructor() {
    this.table = 'entity';
  }

  info() {

  }

}