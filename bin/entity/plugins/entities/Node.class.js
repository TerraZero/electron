'use strict';

const Entity = SYS.route('base.entity');

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