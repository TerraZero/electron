'use strict';

module.exports = class DBDriver extends SYS.Annotation {

  static get targets() { return [this.DEFINITION] }

  definition() {
    return {
      value: '',
    };
  }

};