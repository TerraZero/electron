'use strict';

const CommandBase = SYS.use('bin/sys/CommandBase.class');

/**
  * @Command(
  *   alias=["find"]
  * )
  */
module.exports = class FindCommand extends CommandBase {

  static alias() {
    return 'find';
  }

  /**
    * @Command(
    *   params={
    *     expression: null
    *   }
    * )
    */
  annotations(expression = null) {
    var annotations = TOOLS.Annotation.listAnnotations();

    annotations = TOOLS.Array.filter(annotations, expression);

    for (var i in annotations) {
      this.out(annotations[i].resolve());
    }
  }

  /**
    * @Command(
    *   params={
    *     expression: null
    *   }
    * )
    */
  mods(expression = null) {
    var mods = SYS.lookup('mod', 'mods');

    mods = TOOLS.Array.filter(mods, expression);
    for (var i in mods) {
      this.out(mods[i].resolve());
    }
  }

  /**
    * @Command(
    *   params={
    *     expression: null
    *   }
    * )
    */
  routines(expression = null) {
    var routines = SYS.lookup('routine', 'bin', 'mods');

    routines = TOOLS.Array.filter(routines, expression);
    for (var i in routines) {
      this.out(routines[i].resolve());
    }
  }

  /**
    * @Command(
    *   alias=["class"],
    *   params={
    *     expression: null
    *   }
    * )
    */
  findclass(expression = null) {
    var classes = SYS.lookup('class', 'bin', 'mods');

    classes = TOOLS.Array.filter(classes, expression);
    for (var i in classes) {
      this.out(classes[i].resolve());
    }
  }

}