'use strict';

const Controller = SYS.route('base.controller');
const Field = SYS.use('bin/entity/fields/FieldInstance.class');

/**
  * @Controller(
  *   name="User"
  * )
  */
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