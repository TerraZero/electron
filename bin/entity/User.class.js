'use strict';

const Entity = SYS.use('./Entity.class');
const UC = SYS.use('./controller/UserController.class').instance();

module.exports = class User extends Entity {

  static controller() {
    return UC;
  }

  static type() {
    return 'user';
  }

  constructor(row) {
    super(row);
  }

}