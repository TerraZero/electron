'use strict';

const Controller = SYS.use('Controller.base');

/**
  * @Controller(
  *   name="Node"
  * )
  */
module.exports = class NodeController extends Controller {

  constructor() {
    super();
    this._table = 'node';
  }

  info() {

  }

}