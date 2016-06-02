'use strict';

const Controller = SYS.use('entity/controller/Controller');
const Field = SYS.use('entity/controller/FieldInstance');

let inner = null;

module.exports = class UserController extends Controller {

  static instance() {
    if (inner == null) {
      inner = new UserController();
    }
    return inner;
  }

  constructor() {
    super();
  }

  instanceInfo() {
    this._table = 'user';

    this._fields.id = new Field('id', 'INT').primary();
    this._fields.name = new Field('name', 'VARCHAR(255)').notNull();
  }

}