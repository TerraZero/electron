'use strict';

module.exports = class Datatype extends SYS.Annotation {

  static get targets() { return [this.DEFINITION] }

  definition() {
    return {
      value: null,
    };
  }

};