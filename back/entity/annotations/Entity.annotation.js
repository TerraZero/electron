'use strict';

module.exports = class Entity extends SYS.Annotation {

  static get targets() { return [this.DEFINITION] }

  definition() {
    return {
      id: null,
      name: '',
      controller: null,
      description: '',
    };
  }

};