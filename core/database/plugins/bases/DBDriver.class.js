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
    SYS.throw('AbstractError', 'method', 'connect', this);
  }

  end() {
    SYS.throw('AbstractError', 'method', 'end', this);
  }



  builder() {
    SYS.throw('AbstractError', 'method', 'builder', this);
  }

  select() {
    SYS.throw('AbstractError', 'method', 'select', this);
  }

  insert() {
    SYS.throw('AbstractError', 'method', 'insert', this);
  }

  update() {
    SYS.throw('AbstractError', 'method', 'update', this);
  }

  delete() {
    SYS.throw('AbstractError', 'method', 'delete', this);
  }

}