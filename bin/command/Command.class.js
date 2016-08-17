'use strict';

const CommandBase = SYS.use('bin/sys/CommandBase.class');

const commands = SYS.info('commands');

module.exports = class Command {

  static execute(command, args = []) {
    var exe = command.split('.');
    var execution = {
      command: null,
      result: {},
      args: args,
      exe: exe,
    };

    for (var index in commands) {
      if (commands[index].name == exe[0]) {
        execution.command = SYS.use(commands[index].file, 'command', {args: [args]});
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
      if (suggestions[i].startsWith(execution.exe[1])) {
        found.push(suggestions[i]);
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