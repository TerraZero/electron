'use strict';

module.exports = class Info {

  constructor(boot) {
    this._boot = boot;
  }

  resolve(paths, offset = 0) {
    for (var index in paths) {
      paths[index] = this._boot.resolvePath(paths[index], offset + 1);
    }
    return paths;
  }

}