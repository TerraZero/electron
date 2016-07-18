'use strict';

module.exports = class Info {

  constructor(boot) {
    this._boot = boot;
    this._base = null;
  }

  base() {
    return this._base;
  }

  path(path) {
    if (TOOLS.isArray(path)) {
      for (var index in path) {
        path[index] = this.path(path[index]);
      }
    } else {
      if (path.startsWith('.')) {
        return this.base() + path.substring(1);
      }
    }
    return path;
  }

}