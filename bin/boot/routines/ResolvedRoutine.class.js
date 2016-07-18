'use strict';

var UseRoutine = SYS.use('./UseRoutine');

module.exports = class ResolvedRoutine extends UseRoutine {

  type() {
    return 'resolved';
  }

  useOptions(path, type, options, args) {
    var routine = SYS.getUseRoutine(options.type);

    options.cid = options.cid || cid;
    options.path = options.path || path;
    options.type = options.type || null;
    options.args = options.args || args;

    routine.useOptions(path, type, options, args);
  }

  usePath(path, options = {}) {
    return path;
  }

  useRegex(options = {}) {
    if (options.type) {
      return '.*\.' + options.type + '\.js';
    } else {
      return '.*\.js';
    }
  }

  useExtensions(options = {}) {
    if (options.type) {
      return '.' + options.type + '.js';
    } else {
      return '.js';
    }
  }

  isPackage(path, options = {}) {
    var routine = SYS.getUseRoutine(options.type);

    return routine.isPackage(path, options);
  }

  usePackage(path, options = {}) {
    var routine = SYS.getUseRoutine(options.type);

    return routine.usePackage(path, options);
  }

  useInit(struct, options = {}) {
    var routine = SYS.getUseRoutine(options.type);

    return routine.useInit(struct, options);
  }

}