'use strict';

module.exports = class UseRoutine {

  constructor(boot, module) {
    this._boot = boot;
    this._module = module;
  }

  type() {
    return null;
  }

  /**
    * Determine if a path is a package path
    */
  isPackage(path, options = {}) {
    return path.resolve().endsWith('/');
  }

  /**
    * Define default settings and set settings
    */
  useOptions(path, type, options, args) {
    options.cid = options.cid || cid;
    options.path = options.path || path;
    options.type = options.type || type;
    options.args = options.args || args;
  }

  /**
    * Create package content
    */
  usePackage(path, options = {}) {
    var files = [];
    var pack = {};

    files = TOOLS.File.list(path.resolve(), this.useRegex(options), 1);

    for (var index in files) {
      pack[this._boot.name(files[index])] = Sys.use(this._boot.path(files[index]), this._boot.type(files[index]), true);
    }

    return pack;
  }

  /**
    * Resolve path
    */
  usePath(path, options = {}) {
    return path;
  }

  /**
    * Search regex for package find
    */
  useRegex(options = {}) {
    if (this.type()) {
      return '.*\.' + this.type() + '\.js';
    } else {
      return '.*\.js';
    }
  }

  /**
    * Create file extensions to invoke
    */
  useExtensions(options = {}) {
    if (this.type()) {
      return '.' + this.type() + '.js';
    } else {
      return '.js';
    }
  }

  /**
    * Init struct
    */
  useInit(struct, options = {}) {
    if (TOOLS.isBased(struct, this._module)) {
      return struct.build.apply(struct, options.args);
    }
    return struct;
  }

}