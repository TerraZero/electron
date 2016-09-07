'use strict'

const Annotation = SYS.use('Annotation.base');

module.exports = class Command extends Annotation {

  static get targets() { return [Annotation.METHOD, Annotation.DEFINITION] }

  definition() {
    return {
      id: null,
      description: [],
      alias: [],
      params: {},
    };
  }

};