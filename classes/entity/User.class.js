'use strict';

const Entity = SYS.use('entity/Entity');
const uc = SYS.use('entity/controller/UserController').instance();
const DB = SYS.module('db');

module.exports = class User extends Entity {

  static controller() {
    return uc;
  }

  static multi(ids, callback) {
    DB.execute('SELECT * FROM user u WHERE u.id in (' + ids.join(',') + ')', callback);
  }

  constructor(id = null) {
    super('user');
    if (id) {
      this.load(id);
    }
  }

}