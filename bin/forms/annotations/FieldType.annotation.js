'use strict'

const Annotation = SYS.use('bin/sys/Annotation.class');

module.exports = class FieldType extends Annotation {

  static get targets() { return [Annotation.DEFINITION] }

  definition() {
    return {
      value: null,
    };
  }

};