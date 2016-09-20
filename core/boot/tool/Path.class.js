'use strict';

const NPath = SYS.node('path');
const glob = SYS.node('glob');

module.exports = class Path {

  static list(dir, expression, recursive = null, offset = 0) {
    if (!TOOLS.is(dir, Path)) dir = new Path(dir);
    var files = TOOLS.File.list(dir.resolve(), expression, recursive);

    for (var index in files) {
      files[index] = new Path('$' + files[index], offset + 1);
    }
    return files;
  }

  static glob(dir, pattern, offset = 0) {
    if (!TOOLS.is(dir, Path)) dir = new Path(dir);
    var files = glob.sync(pattern, {
      cwd: dir.resolve(),
    });

    for (var index in files) {
      files[index] = new Path('$' + dir.resolve() + '/' + files[index], offset + 1);
    }
    return files;
  }



  constructor(path, offset = 0) {
    this.path(path);
    this._base = SYS.base();
    if (TOOLS.isString(offset)) {
      this._rel = offset;
    } else {
      this._rel = TOOLS.Reflection.getCaller(offset + 1).dir;
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

    if (this._path.startsWith(':')) {
      this._path = TOOLS.String.replace(this._path.substring(1), SYS.config('base:paths'));
    }

    return this;
  }

  isFinal() {
    return this._final;
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

  parse() {
    return NPath.parse(this.resolve());
  }

  parseSys() {
    var parse = this.parse();
    var sysparse = {};

    sysparse.path = parse.dir + '/' + TOOLS.String.match(parse.name, '^([^\.]*)', 0);
    sysparse.name = TOOLS.String.match(parse.name, '^([^\.]*)', 0);
    sysparse.type = TOOLS.String.match(parse.name, '[^\.]*$', 0);
    return sysparse;
  }

  match(expression) {
    return TOOLS.String.match(this.resolve(), expression);
  }

  /**
    * @Magic
    */
  __filterValue(path) {
    return path.resolve();
  }

}