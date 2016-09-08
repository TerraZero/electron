'use strict'

module.exports = class Command extends SYS.Annotation {

  static get targets() { return [this.METHOD, this.DEFINITION] }

  definition() {
    return {
      id: null,
      description: [],
      alias: [],
      params: {},
      options: {},
    };
  }

};