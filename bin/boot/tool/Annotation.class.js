'use strict';

const AnnotationBase = require('tzero-annotations');
const AnnotationRegistry = new AnnotationBase.Registry();

var init = false;

module.exports = class Annotation {

  static register() {
    if (init) return;

    init = true;
    var files = TOOLS.Array.merge(TOOLS.Path.list(SYS.base() + '/mods', '.*\.annotation\.js'), TOOLS.Path.list(SYS.base() + '/bin', '.*\.annotation\.js'));

    for (var index in files) {
      AnnotationRegistry.registerAnnotation(files[index].resolve());
    }
  }

  static createReader() {
    this.register();
    return new AnnotationBase.Reader(AnnotationRegistry);
  }

}