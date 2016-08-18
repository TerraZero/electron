'use strict';

const CommandBase = SYS.use('bin/sys/CommandBase.class');

// load commands
const commands = SYS.lookup('command', 'mods');
for (var i in commands) {
  commands[i] = SYS.use(commands[i]);
}

module.exports = class Command {

  static execute(command, args = []) {
    var execution = {
      command: null,
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
      if (commands[index].alias() == exe[0]) {
        execution.command = commands[index].build.apply(commands[index], [{args: args}]);
        var applyArgs = TOOLS.args(args, 1);

        try {
          var func = Command.getFunction(execution);

          var code = func.apply(execution.command, applyArgs);
          execution.result = execution.command._getResult();
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
    if (TOOLS.isFunction(execution.command[execution.exe[1]])) {
      return execution.command[execution.exe[1]];
    }
    var suggestions = execution.command._suggestion();
    var found = [];

    for (var i in suggestions) {
      if (suggestions[i].name.startsWith(execution.exe[1])) {
        found.push(suggestions[i]);
      }
    }

    if (found.length == 1) return execution.command[found[0].func || found[0].name];
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