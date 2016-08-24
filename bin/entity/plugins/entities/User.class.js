'use strict';

const Entity = SYS.use('Entity.base');

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