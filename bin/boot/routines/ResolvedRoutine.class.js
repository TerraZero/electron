'use strict';

var UseRoutine = require('./UseRoutine.class.js');

module.exports = class ResolvedRoutine extends UseRoutine {

  type() {
    return 'resolved';
  }

  useOptions(path, type, options, args) {
    options.cid = options.cid || cid;
    options.path = options.path || path;
    options.type = options.type || null;
    options.args = options.args || args;
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

}