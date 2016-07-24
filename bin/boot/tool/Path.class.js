'use strict';

const Path = require('path');

const Boot = require('./../boot.js');

module.exports = class Path {

  static list(dir, expression, recursive = null) {
    var files = TOOLS.File.list(dir, expression, recursive);

    for (var index in files) {
      files[index] = new Path(files[index]);
    }
    return files;
  }

  constructor(path, offset = 0) {
    this.path(path);
    this._base = SYS.base();
    if (TOOLS.isString(offset)) {
      this._rel = offset;
    } else {
      this._rel = Boot.getCaller(offset + 1).dir;
    }
  }

  base(base) {
    return SETGET(this, base, '_base');
  }

  path(path) {
    if (!ISDEF(path)) return this._path;

    this._final = path.startsWith('$');

    if (this._final) {
      this._path = path.substring(1);
    } else {
      this._path = path;
    }
    return this;
  }

  rel(rel) {
    return SETGET(this, rel, '_rel');
  }

  resolve(extend = '') {
    var path = this.path();

    if (this._final) return path;

    if (path.startsWith('.')) {
      path = this.rel() + path.substring(1);
    } else {
      path = this.base() + '/' + path;
    }
    return path + extend;
  }

    /**
    * MAGIC: gives the filter value
    */
  __filterValue(path) {
    return path.resolve();
  }

}