'use strict';

const Entity = SYS.use('./Entity.class');
const NC = SYS.use('./controller/NodeController.class').instance();

module.exports = class Node extends Entity {

  static controller() {
    return NC;
  }

  constructor() {
    super('node');
  }

}