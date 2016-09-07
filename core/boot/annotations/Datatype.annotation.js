'use strict'

const Annotation = SYS.use('Annotation.base');

module.exports = class Datatype extends Annotation {

  static get targets() { return [Annotation.DEFINITION] }

  definition() {
    return {
      value: null,
    };
  }

};