'use strict';

module.exports = class UseRoutine {

  constructor(boot, module) {
    this._boot = boot;
    this._module = module;
  }

  type() {
    return null;
  }

  ifPackage(path, options = {}) {
    return path.endsWith('/');
  }

  usePackage(path, options = {}) {
    var files = [];
    var pack = {};

    files = this._boot.list(path, this.useRegex(options), 1);

    for (var index in files) {
      pack[this._boot.name(files[index])] = Sys.use(this._boot.path(files[index]), this._boot.type(files[index]), true);
    }

    return pack;
  }

  usePath(path, options = {}) {
    if (path.startsWith('.')) {
      path = this._boot.getCaller(2 + offset).dir + path.substring(1);
    } else {
      path = this.base() + '/' + path;
    }

    return path + this.useExtensions(options);
  }

  useRegex(options = {}) {
    if (this.type()) {
      return '.*\.' + this.type() + '\.js';
    } else {
      return '.*\.js';
    }
  }

  useExtensions(options = {}) {
    if (this.type()) {
      return '.' + this.type() + '.js';
    } else {
      return '.js';
    }
  }

  useInit(struct, options = {}) {
    if (TOOLS.isBased(struct, this._module)) {
      return
    }
    return struct;
  }

}