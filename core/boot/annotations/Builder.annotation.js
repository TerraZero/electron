'use strict';

module.exports = class Builder extends SYS.Annotation {

  static get targets() { return [this.DEFINITION] }

  definition() {
    return {
      value: null,
    };
  }

};