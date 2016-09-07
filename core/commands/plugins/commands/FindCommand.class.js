'use strict';

const CommandBase = SYS.route('base.command');
const Command = SYS.route('command');

/**
  * @Command(
  *   alias=["find"]
  * )
  */
module.exports = class FindCommand extends CommandBase {

  /**
    * @Command(
    *   params={
    *     expression: {type: "string", value: null}
    *   },
    *   description=["Show annotations"]
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
    *     expression: {type: "string", value: null}
    *   }
    * )
    */
  mods(expression = null) {
    var mods = SYS.lookup('mod');

    mods = TOOLS.Array.filter(mods, expression);
    for (var i in mods) {
      this.out(mods[i].resolve());
    }
  }

  /**
    * @Command(
    *   params={
    *     expression: {type: "string", value: null}
    *   }
    * )
    */
  routines(expression = null) {
    var routines = SYS.lookup('routine');

    routines = TOOLS.Array.filter(routines, expression);
    for (var i in routines) {
      this.out(routines[i].resolve());
    }
  }

  /**
    * @Command(
    *   alias=["class"],
    *   params={
    *     expression: {type: "string", value: null}
    *   }
    * )
    */
  classes(expression = null) {
    var classes = SYS.lookup('class');

    classes = TOOLS.Array.filter(classes, expression);
    for (var i in classes) {
      this.out(classes[i].resolve());
    }
  }

  /**
    * @Command(
    *   params={
    *     expression: {type: "string", value: null}
    *   }
    * )
    */
  commands(expression = null) {
    var commands = Command.getCommands();

    commands = TOOLS.Array.filter(commands, expression, function(command) {
      return command.path.resolve();
    });

    for (var i in commands) {
      this.out(commands[i].path.resolve());
    }
  }

  /**
    * @Command(
    *   params={
    *     expression: {type: "string", value: null}
    *   }
    * )
    */
  base(expression = null) {
    var bases = SYS.use(TOOLS.Array.filter(SYS.lookup('routine'), '.*BaseRoutine\.routine\.js$')[0]).bases();

    bases = TOOLS.Array.filter(bases, expression, function(base) {
      return base.path.resolve();
    });

    for (var i in bases) {
      this.out(bases[i].path.resolve());
    }
  }

  /**
    * @Command(
    *   params={
    *     annotation: {type: "string"},
    *     expression: {type: "string", value: null}
    *   }
    * )
    */
  plugins(annotation, expression = null) {
    if (!annotation) annotation = this.input('Annotation: ');
    var plugins = SYS.plugins(annotation)[annotation];

    plugins = TOOLS.Array.filter(plugins, expression, function(plugin) {
      return plugin.path.resolve();
    });

    for (var i in plugins) {
      this.out(plugins[i].path.resolve());
    }
  }

  /**
    * @Command(
    *   params={
    *     expression: {type: "string", value: null}
    *   }
    * )
    */
  ids(expression = null) {
    var ids = SYS._loaded_routes;

    ids = TOOLS.Array.filter(ids, expression, function(id) {
      return id.path.resolve();
    });

    for (var i in ids) {
      this.out(ids[i].path.resolve());
    }
  }

}