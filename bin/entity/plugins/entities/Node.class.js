'use strict';

const Entity = SYS.get('base.entity');

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