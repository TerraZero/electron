'use strict';

/**
  * @Base("DBDriver")
  */
module.exports = class DBDriver {

  connect() {
    SYS.throw('AbstractError', 'method', 'connect', this);
  }

  end() {
    SYS.throw('AbstractError', 'method', 'end', this);
  }

}