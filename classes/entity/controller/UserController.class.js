'use strict';

const Controller = SYS.use('entity/controller/Controller');
const Field = SYS.use('entity/controller/FieldController');

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
    this.fields.id = new Field('id', 'INT', {primary: true});
    this.fields.name = new Field('name', 'VARCHAR(255)');
  }

  info() {
    return this.fields;
  }

}