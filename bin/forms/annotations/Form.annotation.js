'use strict'

const Annotation = SYS.use('Annotation.base');

module.exports = class Form extends Annotation {

  static get targets() { return [Annotation.DEFINITION] }

  definition() {
    return {
      id: null,
      value: null,
      description: '',
    };
  }

};