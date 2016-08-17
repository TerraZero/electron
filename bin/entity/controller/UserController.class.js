'use strict';

const Controller = SYS.use('./Controller.class');
const Field = SYS.use('bin/entity/fields/FieldInstance.class');

module.exports = class UserController extends Controller {

  constructor() {
    super();
  }

  instanceInfo() {
    this._table = 'user';

    this._fields.id = new Field('id', 'INT').primary().increment();
    this._fields.name = new Field('name', 'VARCHAR(255)').notNull();
  }

}