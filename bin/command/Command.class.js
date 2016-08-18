'use strict';

const CommandBase = SYS.use('bin/sys/CommandBase.class');

// load commands
const commands = SYS.lookup('command', 'mods', 'bin');
for (var i in commands) {
  commands[i].struct = SYS.use(commands[i]);
}

module.exports = class Command {

  static getCommands() {
    return commands;
  }

  static execute(command, args = []) {
    var execution = {
      command: null,
      path: null,
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

    for (var index in commands) {
      if (commands[index].struct.alias() == exe[0]) {
        execution.path = commands[index];
        execution.command = commands[index].struct.build.apply(commands[index].struct, [{args: args, path: execution.path}]);
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
        break;
      }
    }
    return Command.evaluation(execution);
  }

  static getFunction(execution) {
    var annotations = new TOOLS.Annotation(execution.path);
    var methods = annotations.getMethods('Command');
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