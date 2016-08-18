'use strict';

const CommandBase = SYS.use('bin/sys/CommandBase.class');

const Command = SYS.use('bin/command/Command.class');

module.exports = class FindCommand extends CommandBase {

  static alias() {
    return 'find';
  }

  annotations(expression = null) {
    var annotations = TOOLS.Annotation.listAnnotations();

    annotations = TOOLS.Array.filter(annotations, expression);

    for (var i in annotations) {
      this.out(annotations[i].resolve());
    }
  }

  mods(expression = null) {
    var mods = SYS.lookup('mod', 'mods');

    mods = TOOLS.Array.filter(mods, expression);
    for (var i in mods) {
      this.out(mods[i].resolve());
    }
  }

  routines(expression = null) {
    var routines = SYS.lookup('routine', 'bin', 'mods');

    routines = TOOLS.Array.filter(routines, expression);
    for (var i in routines) {
      this.out(routines[i].resolve());
    }
  }

  _suggestion(suggestions = []) {
    suggestions.push({
      name: 'annotations',
      param: {
        expression: {
          value: null,
        }
      },
    });
    suggestions.push({
      name: 'mods',
      param: {
        expression: {
          value: null,
        }
      },
    });
    suggestions.push({
      name: 'class',
      func: 'findclass',
      param: {
        expression: {
          value: null,
        }
      },
    });
    suggestions.push({
      name: 'routines',
      param: {
        expression: {
          value: null,
        }
      },
    });
    return suggestions;
  }

}