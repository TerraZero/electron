'use strict';

module.exports = class Interface extends SYS.Annotation {

  static get targets() { return [this.DEFINITION] }

  definition() {
    return {
      value: null,
    };
  }

};