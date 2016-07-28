'use strict';

module.exports = class AnnotationReader {

  constructor(reader) {
    this._reader = reader;
  }

  parse(file) {
    this._reader.parse(file);
    return this;
  }

  getDefinitions(index = null) {
    if (index == null) {
      return this._reader.definitionAnnotations;
    }
    if (TOOLS.isString(index)) {
      return TOOLS.Array.filter(this._reader.definitionAnnotations, index, function(value) { return value.name(); });
    }
    return this._reader.definitionAnnotations[index];
  }

}