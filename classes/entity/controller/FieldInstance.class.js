'use strict';

module.exports = class FieldInstance {

  static defaultHandler(entity, name) {
    return {
      get: function() {
        return entity._fields[name];
      },
      set: function(value) {
        entity.flush()._fields[name] = value;
      },
    };
  }

  static defaultValue(entity) {
    return null;
  }

  constructor(name, type) {
    this._name = name;
    this._type = type;
    this._primary = false;
    this._increment = false;
    this._handler = FieldInstance.defaultHandler;
    this._value = FieldInstance.defaultValue;
  }

  name() {
    return this._name;
  }

  type() {
    return this._type;
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

  handler(handler = null) {
    this._handler = handler;
    return this;
  }

  value(f = null) {
    this._value = f;
    return this;
  }

  build() {
    var parts = [
      this.name(),
      this.type(),
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