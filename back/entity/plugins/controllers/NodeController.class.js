'use strict';

const Controller = SYS.route('base.controller');

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