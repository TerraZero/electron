'use strict';

const Controller = SYS.use('./Controller');
const Field = SYS.use('entity/fields/FieldInstance');

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