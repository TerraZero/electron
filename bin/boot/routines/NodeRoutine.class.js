'use strict';

const UseRoutine = SYS.use('bin/boot/routines/UseRoutine');

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
    return path;
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