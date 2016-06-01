'use strict';

var Entity = sys.use('Entity');

module.exports = class Node extends Entity {

  constructor() {
    super();
    this.type = 'Node';
  }

}