'use strict';

module.exports = class FieldType extends SYS.Annotation {

  static get targets() { return [this.DEFINITION] }

  definition() {
    return {
      value: '',
      description: '',
    };
  }

};