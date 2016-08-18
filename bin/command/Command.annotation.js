'use strict'

const Annotation = SYS.use('bin/sys/Annotation.class');

module.exports = class Command extends Annotation {

  static get targets() { return [Annotation.METHOD] }

  definition() {
    return {
      alias: [],
      params: {},
    };
  }

};