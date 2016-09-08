'use strict'

module.exports = class SysRoute extends SYS.Annotation {

  static get targets() { return [this.DEFINITION] }

  definition() {
    return {
      value: null,
      register: null,
      params: [],
      description: '',
      loader: null,
      getter: 'getRoute',
      init: 'initRoute',
      keys: [],
    };
  }

};