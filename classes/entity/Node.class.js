'use strict';

const Entity = SYS.use('entity/Entity');
const NodeController = SYS.use('entity/controller/NodeController');

module.exports = class Node extends Entity {

  constructor() {
    super();
    this.type = 'Node';
  }

  controller() {
    return NodeController.instance();
  }

}