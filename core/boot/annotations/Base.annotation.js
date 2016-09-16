'use strict';

module.exports = class Base extends SYS.Annotation {

  static get targets() { return [this.DEFINITION] }

  definition() {
    return {
      value: null,
    };
  }

};