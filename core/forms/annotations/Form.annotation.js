'use strict';

module.exports = class Form extends SYS.Annotation {

  static get targets() { return [this.DEFINITION] }

  definition() {
    return {
      id: null,
      value: null,
      description: '',
    };
  }

};