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

}