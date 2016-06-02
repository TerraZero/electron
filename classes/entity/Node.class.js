'use strict';

const Entity = SYS.use('entity/Entity');
const nc = SYS.use('entity/controller/NodeController').instance();

module.exports = class Node extends Entity {

  static controller() {
    return nc;
  }

  constructor() {
    super('node');
  }

}