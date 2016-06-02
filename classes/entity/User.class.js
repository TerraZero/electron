'use strict';

const Entity = SYS.use('entity/Entity');
const uc = SYS.use('entity/controller/UserController').instance();

module.exports = class User extends Entity {

  static controller() {
    return uc;
  }

  constructor() {
    super('user');
  }

}