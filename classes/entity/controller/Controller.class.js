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
    this.fields = {};
    this.table = null;
    this.instanceInfo();
  }

  instanceInfo() {
    SYS.abstract(this, 'instanceInfo');
  }

  info() {
    SYS.abstract(this, 'info');
  }

  save(entity) {
    SYS.abstract(this, 'save');
  }

}