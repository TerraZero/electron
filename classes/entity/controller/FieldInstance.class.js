'use strict';

module.exports = class FieldInstance {

  constructor(name, type) {
    this._name = name;
    this._type = type;
    this._primary = false;
  }

  primary(bool) {
    if (bool == undefined) bool = true;
    this._primary = bool;
    return this;
  }

  notNull(bool) {
    if (bool == undefined) bool = true;
    this._notNull = bool;
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
  }

}