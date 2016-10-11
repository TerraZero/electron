'use strict';

const CommandBase = use('base.command');
const Command = use('command');

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
    let annotations = TOOLS.Annotation.listAnnotations();

    annotations = TOOLS.Array.filter(annotations, expression);

    for (let i in annotations) {
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
    let mods = SYS.lookup('mod');

    mods = TOOLS.Array.filter(mods, expression);
    for (let i in mods) {
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
    let routines = SYS.lookup('routine');

    routines = TOOLS.Array.filter(routines, expression);
    for (let i in routines) {
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
    let classes = SYS.lookup('class');

    classes = TOOLS.Array.filter(classes, expression);
    for (let i in classes) {
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
    let commands = Command.getCommands();

    commands = TOOLS.Array.filter(commands, expression, function(command) {
      return command.path.resolve();
    });

    for (let i in commands) {
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
    let bases = inc(TOOLS.Array.filter(SYS.lookup('routine'), '.*BaseRoutine\.routine\.js$')[0]).bases();

    bases = TOOLS.Array.filter(bases, expression, function(base) {
      return base.path.resolve();
    });

    for (let i in bases) {
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
    if (!annotation) annotation = this.input('string', 'Annotation');
    let plugins = SYS.plugins(annotation)[annotation];

    plugins = TOOLS.Array.filter(plugins, expression, function(plugin) {
      return plugin.path.resolve();
    });

    for (let i in plugins) {
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
    let ids = TOOLS.Route.routes;

    ids = TOOLS.Array.filter(ids, expression, function(id) {
      return id.path().resolve();
    });

    for (let i in ids) {
      this.out(ids[i].path().resolve());
    }
  }

}