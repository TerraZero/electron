'use strict';

module.exports = class Controller extends SYS.Annotation {

  static get targets() { return [this.DEFINITION] }

  definition() {
    return {
      id: null,
      name: '',
      description: '',
    };
  }

};