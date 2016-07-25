'use strict';

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
      for (var index in path) {
        path[index] = this.path(path[index]);
      }
    } else {
      return new TOOLS.Path(path, this.base());
    }
    return path;
  }

  list(dir, expression, recursive = null) {
    return TOOLS.Path.list(dir, expression, recursive, 1);
  }

}