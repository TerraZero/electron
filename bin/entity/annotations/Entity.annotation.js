'use strict'

const Annotation = SYS.use('Annotation.base');

module.exports = class Entity extends Annotation {

  static get targets() { return [Annotation.DEFINITION] }

  definition() {
    return {
      id: null,
      name: '',
      controller: '',
      description: '',
    };
  }

};