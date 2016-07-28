'use strict';

const CommandBase = SYS.use('bin/sys/CommandBase');

const Command = SYS.use('bin/command/Command');

module.exports = class FindCommand extends CommandBase {

  annotations(expression = null) {
    var annotations = TOOLS.Annotation.listAnnotations();

    annotations = TOOLS.Array.filter(annotations, expression);

    for (var i in annotations) {
      this.out(annotations[i].resolve());
    }
  }

  mods(expression = null) {
    var mods = SYS.listMods();

    mods = TOOLS.Array.filter(mods, expression);

    for (var i in mods) {
      this.out(mods[i].resolve());
    }
  }

  routines(expression = null) {
    var routines = SYS.info('routines');

    routines = TOOLS.Array.filter(routines, expression);
    for (var i in routines) {
      this.out(routines[i].resolve());
    }
  }

  _suggestion(suggestions = []) {
    suggestions.push('annotations');
    suggestions.push('mods');
    suggestions.push('routines');
    return suggestions;
  }

}