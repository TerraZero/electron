'use strict';

const FS = SYS.node('graceful-fs');
const NPath = SYS.node('path');

module.exports = class File {

  static list(dir, expression, recursive = null) {
    var results = [];

    File.walk(dir, results, recursive);
    return TOOLS.Array.filter(results, expression);
  }

  static walk(dir, results, recursive = null, deep = 0) {
    var list = FS.readdirSync(dir);

    for (var i in list) {
      var file = NPath.resolve(dir, list[i]);
      var stat = FS.statSync(file);

      if (stat && stat.isDirectory()) {
        if (recursive == null || recursive > deep) File.walk(file, results, recursive, deep + 1);
      } else {
        results.push(file);
      }
    }
  }

  static clearDir(path, recursive = true, logger = null, deep = 0) {
    if (logger === true) logger = SYS.route('logger');

    if (FS.existsSync(path)) {
      FS.readdirSync(path).forEach(function(file, index) {
        var filePath = path + '/' + file;

        if (FS.lstatSync(filePath).isDirectory() && recursive) {
          File.clearDir(filePath, recursive, logger, deep + 1);
        } else {
          FS.unlinkSync(filePath);
          if (logger) {
            logger.log('Delete File: ' + filePath);
          }
        }
      });
      if (deep !== 0) {
        FS.rmdirSync(path);
        if (logger) {
          logger.log('Delete Directory: ' + path);
        }
      }
    }
  }

  static content(path) {
    return FS.readFileSync(path).toString();
  }

  static cp(source, destination) {
    const BUF_LENGTH = 64*1024;
    const buff = new Buffer(BUF_LENGTH);
    const fdr = FS.openSync(source, 'r');
    const fdw = FS.openSync(destination, 'w');

    var bytesRead = 1;
    var pos = 0;
    while (bytesRead > 0) {
      bytesRead = FS.readSync(fdr, buff, 0, BUF_LENGTH, pos);
      FS.writeSync(fdw, buff, 0, bytesRead);
      pos += bytesRead;
    }
    FS.closeSync(fdr);
    FS.closeSync(fdw);
  }

  static mkdir(path) {
    return FS.mkdirSync(path);
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
        SYS.throw('FileExistError', file);
      }
      return false;
    } else {
      FS.mkdir(this.file());
      return true;
    }
  }

  list() {
    var list = FS.readdirSync(this.file(''));

    for (var i in list) {
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