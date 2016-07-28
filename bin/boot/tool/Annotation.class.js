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
    return TOOLS.Array.merge(TOOLS.Path.list(SYS.base() + '/mods', '.*\.annotation\.js'), TOOLS.Path.list(SYS.base() + '/bin', '.*\.annotation\.js'));
  }

  constructor(path = null) {
    this._reader = new AnnotationBase.Reader(AnnotationRegistry);
    if (path) this.parse(path);
  }

  parse(path) {
    this._path = path;
    this._reader.parse(path);
    return this;
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

}