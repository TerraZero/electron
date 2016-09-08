'use strict'

module.exports = class FieldType extends SYS.Annotation {

  static get targets() { return [this.DEFINITION] }

  definition() {
    return {
      id: null,
      value: null,
      description: '',
    };
  }

};