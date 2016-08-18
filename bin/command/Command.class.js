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

    execution.info = Command.getCommandInfo(exe[0]);
    execution.command = SYS.use(execution.info.path);
    execution.command = execution.command.build.apply(execution.command, [{args: args, info: execution.info}]);
    var applyArgs = TOOLS.args(args, 1);

    try {
      var func = Command.getFunction(execution);

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

  static getFunction(execution) {
    var methods = execution.info.annotation.getMethods('Command');
    var found = [];

    for (var i in methods) {
      if (methods[i].target.startsWith(execution.exe[1]) || TOOLS.Array.startsWith(methods[i].alias, execution.exe[1])) {
        found.push(methods[i].target);
      }
    }

    if (found.length == 1) return execution.command[found[0]];
    return execution.command.def;
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