'use strict';

const CommandBase = SYS.use('bin/sys/CommandBase.class');

// load commands
const commands = (function() {
  var paths = SYS.lookup('command', 'mods', 'bin');
  var accepted = [];

  for (var i in paths) {
    var annotation = new TOOLS.Annotation(paths[i]);

    if (annotation.getDefinitions('Command').length) {
      accepted.push({
        path: paths[i],
        annotation: annotation,
        alias: annotation.getDefinitions('Command')[0].alias,
      });
    }
  }
  return accepted;
})();

module.exports = class Command {

  static getCommands() {
    return commands;
  }

  static getCommandInfo(name) {
    for (var index in commands) {
      if (TOOLS.Array.inArray(commands[index].alias, name)) {
        return commands[index];
      }
    }
    return null;
  }

  static getCommand(name, args = null) {
    var info = Command.getCommandInfo(name);
    if (!info) return null;

    var struct = SYS.use(info.path);
    var command = struct.build.apply(struct, [{args: args, info: info}]);
    return {
      info: info,
      struct: struct,
      command: command,
    };
  }

  static execute(command, args = []) {
    var execution = {
      command: null,
      info: null,
      result: {},
      args: args,
      exe: null,
    };

    if (!ISDEF(command)) {
      execution.result.code = Command.FATAL;
      CLI.error('No commands to execute found!');
      return execution;
    }
    var exe = command.split('.');
    execution.exe = exe;

    var data = Command.getCommand(exe[0], args);

    execution.info = data.info;
    execution.command = data.command;

    var applyArgs = TOOLS.args(args, 1);

    try {
      var func = Command.getCallFunctionData(data, exe[1]);

      var code = func.apply(execution.command, applyArgs);
      execution.result = execution.command.getResult();
      if (code) {
        execution.result.code = code;
      }
    } catch (e) {
      Command.error(e);
      execution.result.code = Command.FATAL;
    }

    return Command.evaluation(execution);
  }

  static getFunctionData(data, name = null) {
    return Command.getFunction(data.info.annotation, name);
  }

  static getFunction(annotation, name = null) {
    var methods = annotation.getMethods('Command');
    var found = [];

    for (var i in methods) {
      if (!name || methods[i].target.startsWith(name) || TOOLS.Array.startsWith(methods[i].alias, name)) {
        found.push(methods[i]);
      }
    }

    return found;
  }

  static getCallFunctionData(data, name = null) {
    return Command.getCallFunction(data.command, data.info.annotation, name);
  }

  static getCallFunction(command, annotation, name = null) {
    var found = Command.getFunction(annotation, name);

    if (found.length == 1) return command[found[0].target];
    return command.def;
  }

  static error(exception) {
    CLI.error(exception.toString());
  }

  static evaluation(execution) {
    if (execution.result.code === CommandBase.OK) {
      // OK
    } else if (execution.result.code === undefined) {
      CLI.error('No command found with name "%s"', execution.exe[0]);
    } else if (TOOLS.isInt(execution.result.code)) {
      CLI.error('Command terminated unexpectedly with exit code "' + execution.result.code + '"');
    }

    return execution;
  }

}