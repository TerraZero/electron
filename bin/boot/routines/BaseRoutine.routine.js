'use strict';

const UseRoutine = SYS.use('./UseRoutine.routine');
const bases = (function() {
  var paths = SYS.lookup('base', 'bin', 'mods');
  var result = {};

  for (var i in paths) {
    result[paths[i].parseSys().name] = SYS.use(paths[i]);
    result[paths[i].parseSys().name].baseClassPath = paths[i];
  }
  return result;
})();

module.exports = class BaseRoutine extends UseRoutine {

  static bases() {
    return bases;
  }

  isRoutine(path) {
    return path.match('.*\.base$');
  }

  use(path) {
    var name = path.path().substring(0, path.path().length - 5);

    return bases[name];
  }

}