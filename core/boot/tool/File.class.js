'use strict';

const FS = SYS.node('graceful-fs');
const NPath = SYS.node('path');

module.exports = class File {

  static list(dir, expression, recursive = null) {
    let results = [];

    File.walk(dir, results, recursive);
    return TOOLS.Array.filter(results, expression);
  }

  static walk(dir, results, recursive = null, deep = 0) {
    let list = FS.readdirSync(dir);

    for (let i in list) {
      let file = NPath.resolve(dir, list[i]);
      let stat = FS.statSync(file);

      if (stat && stat.isDirectory()) {
        if (recursive == null || recursive > deep) File.walk(file, results, recursive, deep + 1);
      } else {
        results.push(file);
      }
    }
  }

  constructor(path, offset = 0) {
    this._path = TOOLS.path(path, 1 + offset);
    this._content = undefined;
  }

  exist() {
    return FS.existsSync(this.file());
  }

  path() {
    return this._path;
  }

  file(extending = null) {
    return this._path.resolve((extending === null ? '.js' : extending));
  }

  stat(extending = null) {
    return FS.statSync(this.file(extending));
  }

  isDir() {
    return this.stat('').isDirectory();
  }

  isFile() {
    return this.stat().isFile();
  }

  mkdir(quiet = false) {
    if (this.exist()) {
      if (!quiet) {
        throw err('FileExistError', null, this.path());
      }
      return false;
    } else {
      FS.mkdir(this.file());
      return true;
    }
  }

  list() {
    let list = FS.readdirSync(this.file(''));

    for (let i in list) {
      list[i] = new File('$' + this.file('') + '/' + list[i]);
    }
    return list;
  }

  content(extending = null, flush = false) {
    if (this._content === undefined || flush) {
      this._content = FS.readFileSync(this.file(extending));
    }
    return this._content;
  }

  /**
    * @Magic
    */
  __filterValue(file) {
    return file.file();
  }

}