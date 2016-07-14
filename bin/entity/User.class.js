'use strict';

const Entity = SYS.use('./Entity');
const UC = SYS.use('./controller/UserController').instance();

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