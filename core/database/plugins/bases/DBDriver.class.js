'use strict';

/**
  * @Base("DBDriver")
  * @SysRoute(
  *   value="db.driver.<value>",
  *   register="DBDriver",
  *   keys=["value"],
  *   description="Database driver class for <value>",
  *   dir="dbdrivers"
  * )
  * @SysRoute(
  *   value="db.builder.<value>",
  *   register="DBBuilder",
  *   keys=["value"],
  *   description="Query builder for <value> driver",
  *   dir="dbbuilder"
  * )
  */
module.exports = class DBDriver {

  connect() {
    throw err('AbstractError', this, 'connect');
  }

  end() {
    throw err('AbstractError', this, 'end');
  }



  builder() {
    throw err('AbstractError', this, 'builder');
  }

  select() {
    throw err('AbstractError', this, 'select');
  }

  insert() {
    throw err('AbstractError', this, 'insert');
  }

  update() {
    throw err('AbstractError', this, 'update');
  }

  delete() {
    throw err('AbstractError', this, 'delete');
  }

}