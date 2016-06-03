'use strict';

module.exports = class FieldInstance {

  constructor(name, type) {
    this._name = name;
    this._type = type;
    this._primary = false;
    this._increment = false;
    this._private = false;
  }

  primary(bool = true) {
    this._primary = bool;
    return this;
  }

  notNull(bool = true) {
    this._notNull = bool;
    return this;
  }

  increment(bool = true) {
    this._increment = bool;
    return this;
  }

  private(bool = true) {
    this._private = bool;
    return this;
  }

  build() {
    var parts = [
      this._name,
      this._type,
    ];

    this.buildOptions(parts);

    return parts.join(' ');
  }

  buildOptions(parts) {
    if (this._notNull) {
      parts.push('NOT NULL');
    }
    if (this._increment) {
      parts.push('AUTO_INCREMENT');
    }
  }

}