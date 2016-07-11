'use strict';

const Entity = SYS.use('./Entity');
const UC = SYS.use('./controller/UserController').instance();

module.exports = class User extends Entity {

  static controller() {
    return UC;
  }

  constructor(row) {
    super('user', row);
  }

}