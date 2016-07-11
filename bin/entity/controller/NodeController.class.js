'use strict';

const Controller = SYS.use('./Controller');

module.exports = class NodeController extends Controller {

  constructor() {
    super();
    this._table = 'node';
  }

  info() {

  }

}