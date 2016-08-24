'use strict';

const Entity = SYS.use('Entity.base');

/**
  * @Entity(
  *   name="Node"
  * )
  */
module.exports = class Node extends Entity {

  constructor() {
    super('node');
  }

}