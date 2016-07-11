'use strict';

const Entity = SYS.use('./Entity');
const NC = SYS.use('./controller/NodeController').instance();

module.exports = class Node extends Entity {

  static controller() {
    return NC;
  }

  constructor() {
    super('node');
  }

}