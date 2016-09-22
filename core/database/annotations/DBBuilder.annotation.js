'use strict';

module.exports = class DBBuilder extends SYS.Annotation {

  static get targets() { return [this.DEFINITION] }

  definition() {
    return {
      value: '',
    };
  }

};