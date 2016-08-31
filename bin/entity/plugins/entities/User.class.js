'use strict';

const Entity = SYS.get('base.entity');

/**
  * @Entity(
  *   name="User"
  * )
  */
module.exports = class User extends Entity {

  static type() {
    return 'user';
  }

  constructor(row) {
    super(row);
  }

}