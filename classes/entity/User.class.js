'use strict';

const Entity = SYS.use('entity/Entity');
const uc = SYS.use('entity/controller/UserController').instance();

module.exports = class User extends Entity {

  constructor() {
    super('user');
  }

  controller() {
    return uc;
  }

}