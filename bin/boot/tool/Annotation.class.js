'use strict';

const AnnotationBase = require('tzero-annotations');
const AnnotationRegistry = new AnnotationBase.Registry();

module.exports = class Annotation {

  static initialize() {
    var files = Annotation.listAnnotations();

    for (var index in files) {
      AnnotationRegistry.registerAnnotation(files[index].resolve());
    }
  }

  static listAnnotations() {
    return SYS.lookup('annotation', 'bin', 'mods');
  }

  constructor(path = null) {
    if (!TOOLS.is(path, TOOLS.Path)) path = new TOOLS.Path(path);
    this._reader = new AnnotationBase.Reader(AnnotationRegistry);
    if (path) this.parse(path, 1);
  }

  parse(path) {
    if (!TOOLS.is(path, TOOLS.Path)) path = new TOOLS.Path(path);
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