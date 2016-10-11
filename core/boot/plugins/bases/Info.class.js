'use strict';

/**
  * @Base("Info")
  */
module.exports = class Info {

  constructor() {
    this._base = null;
  }

  base() {
    return this._base;
  }

  path(path) {
    if (TOOLS.is(path, TOOLS.Path)) return path;

    if (TOOLS.isArray(path)) {
      for (let index in path) {
        path[index] = this.path(path[index]);
      }
    } else {
      return new TOOLS.Path(path, this.base());
    }
    return path;
  }

}