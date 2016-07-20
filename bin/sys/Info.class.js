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
      return TOOLS.resolvePath(path, this.base());
    }
    return path;
  }

  list(dir, expression, recursive = null) {
    var list = this._boot.list(dir, expression, recursive);

    return TOOLS.pathResolved(list);
  }

  filter(array, expression = null, value = null) {
    return this._boot.filter(array, expression, value);
  }

}