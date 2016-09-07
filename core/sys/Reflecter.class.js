'use strict';

class Reflecter {

  constructor(object, parent = null, strict = false) {
    this._object = object;
    this._parent = parent;
    this._strict = strict;
  }

  setStrict(mode = true) {
    this._strict = mode;
    return this;
  }

  parent() {
    return this._parent;
  }

  list(strict = false, backup = null) {
    if (this.isArray()) return this._object;
    if (this._strict || strict) return backup;
    if (this.isString()) return [this._object];
    if (this.isFunction()) return this.call().list(strict, backup);
  }

  call() {
    var parent = this._parent && this._parent._object || null;
    return build(this._object.call(parent, SYS.args(arguments)), this._parent, this._strict);
  }

  is() {
    if (this.isFunction()) return 'function';
    if (this.isString()) return 'string';
    if (this.isArray()) return 'array';
    if (this.isNull()) return 'null';
    return 'object';
  }

  isNull() {
    return this._object === null;
  }

  isArray() {
    return Object.prototype.toString.call(this._object) === '[object Array]';
  }

  isFunction() {
    return typeof this._object === 'function';
  }

  isString() {
    return typeof this._object === 'string';
  }

}

function build(object, parent, strict) {
  return new Proxy(new Reflecter(object, parent, strict), {

    get: function(target, key) {
      if (target[key] !== undefined) return target[key];
      if (target._object) {
        return build(target._object[key], target, target._strict);
      }
      throw new TypeError('Object has no "' + key + '" property');
    },

  });
}

module.exports = build;