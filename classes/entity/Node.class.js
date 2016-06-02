'use strict';

var Entity = SYS.use('entity/Entity');

module.exports = class Node extends Entity {

  constructor() {
    super();
    this.type = 'Node';
  }

}