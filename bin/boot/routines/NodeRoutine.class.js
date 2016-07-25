'use strict';

var UseRoutine = SYS.use('./UseRoutine');

module.exports = class NodeRoutine extends UseRoutine {

  type() {
    return 'node';
  }

  isPackage(path, options = {}) {
    return false;
  }

  usePackage(path, options = {}) {
    // TODO ERROR
  }

  usePath(path, options = {}) {
    // make the path final
    return path.path('$' + path.path());
  }

  useRegex(options = {}) {
    // TODO ERROR
  }

  useExtensions(options = {}) {
    return '';
  }

  useInit(struct, options = {}) {
    return struct;
  }

}