'use strict';

module.exports = class FormField extends SYS.Annotation {

  static get targets() { return [this.DEFINITION] }

  definition() {
    return {
      id: null,
      value: null,
      description: '',
    };
  }

};