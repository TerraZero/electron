'use strict';

const Controller = SYS.use('entity/controller/Controller');
const Field = SYS.use('entity/controller/FieldInstance');

let _instance = null;

module.exports = class UserController extends Controller {

  static instance() {
    if (_instance == null) {
      _instance = new UserController();
    }
    return _instance;
  }

  constructor() {
    super();
  }

  instanceInfo() {
    this._table = 'user';

    this._fields.id = new Field('id', 'INT').primary().increment();
    this._fields.name = new Field('name', 'VARCHAR(255)').notNull();
  }

  insert(user) {
    console.log(user);
  }

}