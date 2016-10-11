'use strict';

const AnnotationBase = require('tzero-annotations');
const AnnotationRegistry = new AnnotationBase.Registry();

module.exports = class Annotation {

  static initialize() {
    let files = Annotation.listAnnotations();

    for (let index in files) {
      AnnotationRegistry.registerAnnotation(files[index].resolve());
    }
  }

  static listAnnotations() {
    return SYS.lookup('annotation');
  }

  constructor(path = null) {
    path = TOOLS.path(path);
    this._reader = new AnnotationBase.Reader(AnnotationRegistry);
    if (path) this.parse(path, 1);
  }

  parse(path) {
    path = TOOLS.path(path);
    this._path = path;
    this._reader.parse(path.resolve('.js'));
    return this;
  }

  hasDefinition(name) {
    return this.getDefinitions(name).length > 0;
  }

  getDefinitions(index = null) {
    if (TOOLS.isInt(index)) {
      return this._reader.definitionAnnotations[index];
    }
    if (TOOLS.isString(index)) {
      return TOOLS.Array.filter(this._reader.definitionAnnotations, index);
    }
    if (TOOLS.isArray(index)) {
      return TOOLS.Array.filter(this._reader.definitionAnnotations, '(' + index.join('|') + ')');
    }
    return this._reader.definitionAnnotations;
  }

  getMethods(index = null) {
    if (TOOLS.isInt(index)) {
      return this._reader.methodAnnotations[index];
    }
    if (TOOLS.isString(index)) {
      return TOOLS.Array.filter(this._reader.methodAnnotations, index);
    }
    return this._reader.methodAnnotations;
  }

}