'use strict';

module.exports = class Magic extends SYS.Annotation {

  static get targets() { return [this.DEFINITION, this.METHOD] }

  definition() {
    return {
      value: null, // function name
      description: null, // description
    };
  }

};