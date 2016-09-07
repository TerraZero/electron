'use strict'

const Annotation = SYS.use('Annotation.base');

module.exports = class SysRoute extends Annotation {

  static get targets() { return [Annotation.DEFINITION] }

  definition() {
    return {
      value: null,
      register: null,
      params: [],
      description: '',
      loader: null,
      getFunction: 'getRoute',
      initFunction: 'initRoute',
      keys: [],
    };
  }

};