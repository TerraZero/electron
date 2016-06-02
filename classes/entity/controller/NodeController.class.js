'use strict';

const Controller = SYS.use('entity/controller/Controller');

let inner = null;

module.exports = class NodeController extends Controller {

  static instance() {
    if (inner == null) {
      inner = new NodeController();
    }
    return inner;
  }

  constructor() {
    super();
    this._table = 'node';
  }

  info() {

  }

}